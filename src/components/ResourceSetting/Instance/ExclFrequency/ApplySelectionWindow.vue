<template>
    <modal-window v-if="this.windowAlive" :window-title="windowTitle" :window-bg-color="windowBgColor" @closeModalWindow="cancel">
        <div class="w3-small w3-panel w3-card" slot="content">
            <div v-if="applyType[1]" class="w3-row-padding w3-section">
                <v-jstree :data="freqTreeData" text-field-name="name" show-checkbox multiple allow-batch whole-row @item-click="freqTreeClick" ref="freqTree"></v-jstree>
            </div>
            <div v-else-if="applyType[2]" class="w3-row-padding w3-section">
                <v-jstree :data="jobTreeData" text-field-name="name" show-checkbox multiple allow-batch whole-row @item-click="jobTreeClick" ref="jobTree"></v-jstree>
            </div>
            <div v-else-if="applyType[3]" class="w3-row-padding w3-section">
                <v-jstree :data="flowTreeData" text-field-name="name" show-checkbox multiple allow-batch whole-row @item-click="flowTreeClick" ref="flowTree"></v-jstree>
            </div>
        </div>
        <div slot="footer">
            <form-button btn-color="signal-white" :hasReset="false" @cancel="cancel" @save="save"></form-button>
        </div>
    </modal-window>
</template>
<script>
    import { HTTP_TRINITY, errorHandle } from '../../../../util_js/axios_util'
    import ModalWindow from '../../../Common/window/ModalWindow.vue'
    import FormButton from '../../FormButton.vue'
    import VJstree from 'vue-jstree'

    export default {
        components: {
            'modal-window': ModalWindow,
            'form-button': FormButton,
            'v-jstree': VJstree
        },
        data() {
            return {
                applyType: this.tabsFlag,
                freqTreeData: [],
                jobTreeData: [],
                flowTreeData: [],
                freqs: [],
                jobs: [],
                flows: [],
            }
        },
        watch: {
            frequencyUids: function(value) {
                this.freqTreeData = []
                this.getFreqTree()
            },
            jobUids: function(value) {
                this.jobTreeData = []
                this.getJobTree()
            },
            flowUids: function(value) {
                this.treeData = []
                this.getFlowTree()
            }
        },
        props: {
            tabsFlag: {
                type: Array,
                default: () => []
            },
            windowTitle: {
                type: String,
                default: ''
            },
            windowBgColor: {
                type: String,
                default: 'camo-black'
            },
            windowAlive: {
                type: Boolean,
                default: false
            },
            excludefrequencyuid: '',
            frequencyUids: {
                type: Array,
                default: () => []
            },
            jobUids: {
                type: Array,
                default: () => []
            },
            flowUids: {
                type: Array,
                default: () => []
            }
        },
        methods: {
            cancel() {
                this.$emit('closeApply')
            },
            getFreqTree() {
                let params = {
                    'l1_icon': 'fa fa-folder w3-text-amber',
                    'l2_icon': 'fa fa-calendar-check-o w3-text-amber',
                    'frequencyUids': this.frequencyUids
                }

                HTTP_TRINITY.post(`frequency/findForTree`, params)
                    .then(response => {
                        this.freqTreeData = response.data
                    })
                    .catch(error => {
                        errorHandle(this.$store, error)
                    })
            },
            getJobTree() {
                let params = {
                    'l1_icon': 'fa fa-folder w3-text-amber',
                    'l2_icon': 'fa fa-folder w3-text-amber',
                    'l3_icon': 'fa fa-th-list w3-text-amber',
                    'jobUids': this.jobUids
                }

                HTTP_TRINITY.post(`job/findForTree`, params)
                    .then(response => {
                        this.jobTreeData = response.data
                    })
                    .catch(error => {
                        errorHandle(this.$store, error)
                    })
            },
            getFlowTree() {
                let params = {
                    'l1_icon': 'fa fa-folder w3-text-amber',
                    'l2_icon': 'fa fa-folder w3-text-amber',
                    'l3_icon': 'fa fa-clone w3-text-amber',
                    'flowUids': this.flowUids
                }

                HTTP_TRINITY.post(`jobflow/findForTree`, params)
                    .then(response => {
                        this.flowTreeData = response.data
                    })
                    .catch(error => {
                        errorHandle(this.$store, error)
                    })
            },
            freqTreeClick() {
                this.freqs = []
                this.$refs.freqTree.handleRecursionNodeChilds(this.$refs.freqTree, node => {
                    if (node.model && node.model.selected && node.model.icon.indexOf('fa-calendar-check-o') > -1) {
                        this.freqs.push(node.model.id)
                    }
                })
            },
            jobTreeClick() {
                this.jobs = []
                this.$refs.jobTree.handleRecursionNodeChilds(this.$refs.jobTree, node => {
                    if (node.model && node.model.selected && node.model.icon.indexOf('fa-th-list') > -1) {
                        this.jobs.push(node.model.id)
                    }
                })
            },
            flowTreeClick() {
                this.flows = []
                this.$refs.flowTree.handleRecursionNodeChilds(this.$refs.flowTree, node => {
                    if (node.model && node.model.selected && node.model.icon.indexOf('fa-clone') > -1) {
                        this.flows.push(node.model.id)
                    }
                })
            },
            save() {
                if (this.applyType[1]) {  //for freq exclude
                    for (let i = 0; i < this.freqs.length; i++) {
                        HTTP_TRINITY.post('freq-exclude/addOne', {
                            "frequencyuid": this.freqs[i],
                            "excludefrequencyuid": this.excludefrequencyuid
                        }).then(response => {
                            if (i == this.freqs.length - 1) {
                                this.$emit('applyFrequency')
                                this.cancel()
                            }
                        }).catch(error => {
                            errorHandle(this.$store, error)
                        })
                    }
                } else if (this.applyType[2]) {  //for job exclude
                    for (let i = 0; i < this.jobs.length; i++) {
                        HTTP_TRINITY.post('job-exclude/addOne', {
                            "jobuid": this.jobs[i],
                            "excludefrequencyuid": this.excludefrequencyuid
                        }).then(response => {
                            if (i == this.jobs.length - 1) {
                                this.$emit('applyJob')
                                this.cancel()
                            }
                        }).catch(error => {
                            errorHandle(this.$store, error)
                        })
                    }
                } else if (this.applyType[3]) {  //for jobflow exclude
                    for (let i = 0; i < this.flows.length; i++) {
                        HTTP_TRINITY.post('jobflow-exclude/addOne', {
                            "jobflowuid": this.flows[i],
                            "excludefrequencyuid": this.excludefrequencyuid
                        }).then(response => {
                            if (i == this.flows.length - 1) {
                                this.$emit('applyFlow')
                                this.cancel()
                            }
                        }).catch(error => {
                            errorHandle(this.$store, error)
                        })
                    }
                }
            }
        }
    }
</script>
<style scoped>

    input, select {
        height: 30px
    }

        input.w3-check {
            height: 20px
        }
</style>