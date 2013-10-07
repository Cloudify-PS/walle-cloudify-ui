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

import org.cloudifysource.cosmo.utils.ResourceExtractor;
import org.fest.assertions.api.Assertions;
import org.testng.annotations.Test;

import java.io.IOException;
import java.net.URISyntaxException;
import java.nio.file.Files;
import java.nio.file.Path;

/**
 * TODO: Write a short summary of this type's roles and responsibilities.
 *
 * @author Dan Kilman
 * @since 0.1
 */
public class ResourceExtractorTest {

    @Test
    public void testPackageExtractor() throws IOException, URISyntaxException {

        Path target = Files.createTempDirectory("jar-package-extractor-test");

        // This is the package we want to extract from a certain jar
        String packagePath = "org/cloudifysource/cosmo";

        String firstResource = "org/cloudifysource/cosmo/dsl";
        String secondResource = "org/cloudifysource/cosmo/fileserver";
        String thirdResource = "org/cloudifysource/cosmo/orchestrator";

        ResourceExtractor.extractResource(packagePath, target);

        Assertions.assertThat(target.resolve(firstResource).toFile()).exists();
        Assertions.assertThat(target.resolve(secondResource).toFile()).exists();
        Assertions.assertThat(target.resolve(thirdResource).toFile()).exists();

    }

}
