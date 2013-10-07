/*******************************************************************************
 * Copyright (c) 2013 GigaSpaces Technologies Ltd. All rights reserved
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *******************************************************************************/

package org.cloudifysource.cosmo.manager;

import com.google.common.base.Charsets;
import com.google.common.base.Throwables;
import com.google.common.collect.Maps;
import com.google.common.io.Resources;
import org.cloudifysource.cosmo.logging.Logger;
import org.cloudifysource.cosmo.logging.LoggerFactory;
import org.cloudifysource.cosmo.manager.config.MainManagerConfig;
import org.cloudifysource.cosmo.manager.dsl.DSLImporter;
import org.cloudifysource.cosmo.orchestrator.workflow.RuoteRuntime;
import org.cloudifysource.cosmo.orchestrator.workflow.RuoteWorkflow;
import org.cloudifysource.cosmo.utils.ResourceExtractor;
import org.cloudifysource.cosmo.utils.config.TemporaryDirectoryConfig;
import org.robobninjas.riemann.spring.server.RiemannProcess;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

import java.io.IOException;
import java.net.URL;
import java.net.URLClassLoader;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;

/**
 * Starts several manager based components.
 *
 * @author Dan Kilman
 * @since 0.1
 */
public class Manager {

    private static final Logger LOGGER = LoggerFactory.getLogger(Manager.class);

    private static final String RUBY_RESOURCES_CLASS_LOADER_BEAN_NAME = "rubyResourcesClassLoader";
    private static final String SCRIPTS_RESOURCE_PATH = "scripts";
    private static final String RUOTE_GEMS_RESOURCE_PATH = "ruote-gems/gems";
    private static final String TEMPORARY_DIRECTORY_BEAN_NAME = "temporaryDirectory";

    private AnnotationConfigApplicationContext mainContext;
    private AnnotationConfigApplicationContext bootContext;
    private boolean closed;
    private RuoteWorkflow ruoteWorkflow;
    private RuoteRuntime ruoteRuntime;
    private RiemannProcess riemannProcess;
    private TemporaryDirectoryConfig.TemporaryDirectory temporaryDirectory;
    private DSLImporter dslImporter;

    public void init() throws IOException {
        this.bootContext = registerTempDirectoryConfig();
        this.temporaryDirectory =
                (TemporaryDirectoryConfig.TemporaryDirectory) bootContext.getBean("temporaryDirectory");
        this.mainContext = registerConfig(temporaryDirectory.get().toPath(), temporaryDirectory);
        this.ruoteWorkflow = (RuoteWorkflow) mainContext.getBean("defaultRuoteWorkflow");
        this.ruoteRuntime = (RuoteRuntime) mainContext.getBean("ruoteRuntime");
        this.riemannProcess = (RiemannProcess) mainContext.getBean("riemann");
        this.temporaryDirectory =
                (TemporaryDirectoryConfig.TemporaryDirectory) mainContext.getBean("temporaryDirectory");
        this.dslImporter = (DSLImporter) mainContext.getBean("dslImporter");
    }

    public void deployDSL(String dslPath, long timeoutInSeconds) throws IOException {

        String dslLocation = dslImporter.importDSL(Paths.get(dslPath));

        final Map<String, Object> workitemFields = Maps.newHashMap();
        workitemFields.put("dsl", dslLocation);
        workitemFields.put("riemann_pid", String.valueOf(riemannProcess.getPid()));
        workitemFields.put("riemann_config_path", temporaryDirectory.get()
                .getAbsolutePath() + "/riemann/riemann.config");
        workitemFields.put("riemann_config_template", readRiemannConfigTemplate());

        final Object wfid = ruoteWorkflow.asyncExecute(workitemFields);
        ruoteRuntime.waitForWorkflow(wfid, timeoutInSeconds);
    }

    public void close() throws Exception {

        closeContext(mainContext);

        // very important. close this context after the main one.
        // since this contains the temporary directory holding all the process pid files.

        closeContext(bootContext);
        this.closed = true;
    }

    private void closeContext(AnnotationConfigApplicationContext context) throws IOException {
        if (context != null && context.isActive()) {
            LOGGER.debug("Closing spring application context : " + context);
            context.close();
        }
    }

    public boolean isClosed() {
        return this.closed;
    }

    private static String readRiemannConfigTemplate() {
        URL resource = Resources.getResource("riemann/riemann.config.template");
        try {
            return Resources.toString(resource, Charsets.UTF_8);
        } catch (IOException e) {
            throw Throwables.propagate(e);
        }
    }

    private AnnotationConfigApplicationContext registerConfig(
            Path extractionPath,
            TemporaryDirectoryConfig.TemporaryDirectory temporaryDirectory) throws IOException {

        ResourceExtractor.extractResource(SCRIPTS_RESOURCE_PATH, extractionPath);
        ResourceExtractor.extractResource(RUOTE_GEMS_RESOURCE_PATH, extractionPath);
        URLClassLoader ruoteClassLoader = new URLClassLoader(new URL[] {
                extractionPath.toAbsolutePath().toUri().toURL() }, null);
        AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext();
        context.getBeanFactory().registerSingleton(RUBY_RESOURCES_CLASS_LOADER_BEAN_NAME, ruoteClassLoader);
        context.getBeanFactory().registerSingleton(TEMPORARY_DIRECTORY_BEAN_NAME, temporaryDirectory);
        context.register(MainManagerConfig.class);
        context.refresh();
        return context;
    }

    private AnnotationConfigApplicationContext registerTempDirectoryConfig() {
        AnnotationConfigApplicationContext contextForTempDir = new AnnotationConfigApplicationContext();
        contextForTempDir.register(TemporaryDirectoryConfig.class);
        contextForTempDir.refresh();
        return contextForTempDir;
    }
}
