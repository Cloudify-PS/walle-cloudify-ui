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
 ******************************************************************************/

package org.cloudifysource.cosmo.manager.config;

import org.cloudifysource.cosmo.logging.Logger;
import org.cloudifysource.cosmo.manager.ManagerLogDescription;
import org.cloudifysource.cosmo.orchestrator.workflow.RuoteRuntime;
import org.cloudifysource.cosmo.orchestrator.workflow.config.RuoteRuntimeConfig;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.inject.Inject;
import java.io.IOException;

/**
 * Creates a new {@link org.cloudifysource.cosmo.orchestrator.workflow.RuoteRuntime}.
 * It uses a logger to report creation to the user.
 *
 * @author Eli Polonsky
 * @since 0.1
 */
@Configuration
public class ManagementRuoteRuntimeConfig extends RuoteRuntimeConfig {

    @Inject
    private Logger logger;

    @Override
    @Bean
    public RuoteRuntime ruoteRuntime() throws IOException {
        logger.info(ManagerLogDescription.CREATING_RUNTIME_ENVIRONMENT);
        return super.ruoteRuntime();
    }


}
