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

import org.testng.annotations.Test;

import java.util.List;

import static org.fest.assertions.api.Assertions.assertThat;

/**
 * Tests the import mechanism of the {@link DSLProcessor}.
 *
 * @author Dan Kilman
 * @since 0.1
 */
public class DSLProcessorImportsTest extends AbstractDSLProcessorTest {

    @Test
    public void testValidImports() {

        String validImportsDSLResource = "org/cloudifysource/cosmo/dsl/unit/imports/valid/dsl-with-imports.yaml";

        Processed processed = process(validImportsDSLResource);

        List<Node> nodes = processed.getNodes();

        assertValidNode(findNode(nodes, "some_service_template.type0_template"), "node_radial_stub");
        assertValidNode(findNode(nodes, "some_service_template.type1_template"), "type1_radial_stub_override");
        assertValidNode(findNode(nodes, "some_service_template.type2_template"), "type2_radial_stub");
        assertValidNode(findNode(nodes, "some_service_template.type3_template"), "type3_radial_stub");
        assertValidNode(findNode(nodes, "some_service_template.type1_sub_template"), "type1_radial_stub_override");
        assertValidNode(findNode(nodes, "some_service_template.type2_sub_template"), "type2_sub_radial_stub_override");
        assertValidNode(findNode(nodes, "some_service_template.type3_sub_template"),
                "type3_sub_template_radial_stub_override");

    }

    @Test(expectedExceptions = IllegalArgumentException.class,
          expectedExceptionsMessageRegExp = ".*override definition.*")
    public void testInvalidOverrideDefinition() {

        String invalidImportsDSLResource = "org/cloudifysource/cosmo/dsl/unit/imports/invalid/definition/" +
                "dsl-with-imports-invalid-definition.yaml";

        process(invalidImportsDSLResource);
    }

    @Test
    public void testRelativeImports() {
        String resource = "org/cloudifysource/cosmo/dsl/unit/imports/valid/relative/dsl-with-relative-imports.yaml";
        Processed processed = process(resource);
        List<Node> nodes = processed.getNodes();
        assertThat(findNode(nodes, "relative_imports_template.test_a")).isNotNull();
        assertThat(findNode(nodes, "relative_imports_template.test_b")).isNotNull();
        assertThat(findNode(nodes, "relative_imports_template.test_c")).isNotNull();
        assertThat(findNode(nodes, "relative_imports_template.test_0")).isNotNull();
    }


    private void assertValidNode(Node node, String initWorkflow) {
        assertThat(node.getWorkflows().get("init")).isEqualTo(initWorkflow);
    }

}
