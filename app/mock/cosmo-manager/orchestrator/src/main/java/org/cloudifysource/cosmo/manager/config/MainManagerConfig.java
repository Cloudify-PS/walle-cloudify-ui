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

package org.cloudifysource.cosmo.manager.config;

import org.cloudifysource.cosmo.manager.dsl.config.JettyDSLImporterConfig;
import org.cloudifysource.cosmo.monitor.config.RiemannEventsLoggerConfig;
import org.cloudifysource.cosmo.monitor.config.StateCacheFeederConfig;
import org.cloudifysource.cosmo.orchestrator.workflow.config.DefaultRuoteWorkflowConfig;
import org.cloudifysource.cosmo.statecache.config.StateCacheConfig;
import org.cloudifysource.cosmo.tasks.config.TaskExecutorConfig;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.PropertySource;
import org.springframework.context.support.PropertySourcesPlaceholderConfigurer;
import org.springframework.validation.beanvalidation.BeanValidationPostProcessor;

/**
 * Configuration for starting a new manager.
 *
 * @author Dan Kilman
 * @since 0.1
 */
@Configuration
@Import({
        ManagementLoggerConfig.class,
        StateCacheConfig.class,
        TaskExecutorConfig.class,
        JettyFileServerForPluginsConfig.class,
        JettyDSLImporterConfig.class,
        DefaultRuoteWorkflowConfig.class,
        ManagementRuoteRuntimeConfig.class,
        CeleryWorkerProcessConfig.class,
        RiemannProcessConfiguration.class,
        StateCacheConfig.class,
        StateCacheFeederConfig.class,
        VagrantRiemannMonitorProcessConfig.class,
        RiemannEventsLoggerConfig.class
})

// adding this prop file here since riemann configuration is not part of the orchestrator
@PropertySource("org/cloudifysource/cosmo/manager/riemann/riemann.properties")
public class MainManagerConfig {

    @Bean
    public static PropertySourcesPlaceholderConfigurer propertySourcesPlaceholderConfigurer() {
        return new PropertySourcesPlaceholderConfigurer();
    }

    @Bean
    public static BeanValidationPostProcessor beanValidationPostProcessor() {
        return new BeanValidationPostProcessor();
    }

}
