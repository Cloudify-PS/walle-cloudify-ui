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


import com.google.common.collect.Lists;

import java.util.List;

/**
 * A class used to represent a type template.
*
* @author Dan Kilman
* @since 0.1
*/
public class TypeTemplate extends Type {

    private List<RelationshipTemplate> relationships = Lists.newArrayList();

    public List<RelationshipTemplate> getRelationships() {
        return relationships;
    }

    public void setRelationships(List<RelationshipTemplate> relationships) {
        this.relationships = relationships;
    }

    public String getType() {
        return getDerivedFrom();
    }

    public void setType(String type) {
        setDerivedFrom(type);
    }

    @Override
    public InheritedDefinition newInstanceWithInheritance(InheritedDefinition parent) {
        Type typedParent = (Type) parent;
        TypeTemplate result = new TypeTemplate();
        result.inheritPropertiesFrom(typedParent);
        result.inheritPropertiesFrom(this);
        result.setName(getName());
        result.setSuperTypes(parent);
        return result;
    }

    protected void inheritPropertiesFrom(TypeTemplate other) {
        super.inheritPropertiesFrom(other);
        relationships.addAll(other.getRelationships());
    }
}
