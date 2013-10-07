#/*******************************************************************************
# * Copyright (c) 2013 GigaSpaces Technologies Ltd. All rights reserved
# *
# * Licensed under the Apache License, Version 2.0 (the "License");
# * you may not use this file except in compliance with the License.
# * You may obtain a copy of the License at
# *
# *       http://www.apache.org/licenses/LICENSE-2.0
# *
# * Unless required by applicable law or agreed to in writing, software
# * distributed under the License is distributed on an "AS IS" BASIS,
#    * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#    * See the License for the specific language governing permissions and
#    * limitations under the License.
# *******************************************************************************/

"""
Vagrant provisioner tasks.
"""

import os
import vagrant
import tempfile
import subprocess
import sys
from celery.utils.log import get_task_logger

from cosmo.celery import celery

RUNNING = 'running'
VAGRANT_PATH = os.path.join(tempfile.gettempdir(), "vagrant-vms")

logger = get_task_logger(__name__)


@celery.task
def provision(vagrant_file, __cloudify_id, ssh_conf=None, **kwargs):
    logger.info('creating vagrant file [id=%s, vagrant_file=\n%s]', __cloudify_id, vagrant_file)
    v = get_vagrant(__cloudify_id, True)
    with open("{0}/Vagrantfile".format(v.root), 'w') as output_file:
        output_file.write(vagrant_file)
    start_monitor(v, __cloudify_id, ssh_conf)


@celery.task
def start(__cloudify_id, provider='virtualbox', **kwargs):
    logger.info('vagrant up [id=%s]', __cloudify_id)
    v = get_vagrant(__cloudify_id)
    if status(v, __cloudify_id) != RUNNING:
        return v.up(provider)
    logger.info('vagrant vm is already up [id=%s]', __cloudify_id)


@celery.task
def stop(__cloudify_id, **kwargs):
    logger.info('vagrant halt [id=%s]', __cloudify_id)
    v = get_vagrant(__cloudify_id)
    if status(v, __cloudify_id) == RUNNING:
        return v.halt()
    logger.info('vagrant vm is not running [id=%s]', __cloudify_id)


@celery.task
def terminate(__cloudify_id, **kwargs):
    logger.info("vagrant destroy [id=%s]", __cloudify_id)
    v = get_vagrant(__cloudify_id)
    return v.destroy()


def get_vagrant(vm_id, create=False):
    vm_path = os.path.join(VAGRANT_PATH, vm_id)
    if not os.path.exists(vm_path):
        if create:
            os.makedirs(vm_path)
        else:
            raise RuntimeError("vagrant vm with id [{0}] does not exist".format(vm_id))
    return vagrant.Vagrant(vm_path)


def status(v, host_id):
    logger.debug("vagrant status [id=%s]", host_id)

    # we assume a single vm vagrant file
    v_status = v.status()
    return v_status.itervalues().next()


def start_monitor(v, host_id, ssh_conf):
    # ssh_conf = v.conf()

    host_arg = port_arg = nic_arg = ""
    if ssh_conf is not None:  # allow to pass specific host and port (useful for lxc environment)

        if 'host' in ssh_conf:
            host_arg = "--ssh_host={0}".format(ssh_conf['host'])
        if 'port' in ssh_conf:
            port_arg = "--ssh_port={0}".format(ssh_conf['port'])
        if 'nic' in ssh_conf:
            nic_arg = "--vagrant_nic={0}".format(ssh_conf['nic'])

    command = [
        sys.executable,
        os.path.join(os.path.dirname(__file__), "monitor.py"),
        "--tag=name={0}".format(host_id),
        host_arg,
        port_arg,
        nic_arg,
        # "--ssh_user={0}".format(ssh_conf['User']),
        # "--ssh_keyfile={0}".format(ssh_conf['IdentityFile']),
        "--pid_file={0}".format(os.path.join(v.root, "monitor.pid"))
    ]
    command = filter(lambda s: len(s) > 0, command)

    logger.info('starting vagrant monitoring [id=%s, cmd=%s]', host_id, command)
    subprocess.Popen(command)

