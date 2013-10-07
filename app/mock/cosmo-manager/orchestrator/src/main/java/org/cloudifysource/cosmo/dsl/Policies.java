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

package org.cloudifysource.cosmo.dsl;

import com.google.common.collect.Maps;

import java.util.Map;

/**
 * A class used to represent a policy of the dsl.
 * Used internally only by the dsl processor.
 *
 * @author Dan Kilman
 * @since 0.1
 */
public class Policies {

    private Map<String, RuleDefinition> rules = Maps.newHashMap();
    private Map<String, PolicyDefinition> types = Maps.newHashMap();

    public Map<String, RuleDefinition> getRules() {
        return rules;
    }

    public void setRules(Map<String, RuleDefinition> rules) {
        this.rules = rules;
    }

    public Map<String, PolicyDefinition> getTypes() {
        return types;
    }

    public void setTypes(Map<String, PolicyDefinition> types) {
        this.types = types;
    }

}
