<template>
<div>
    <div class="w3-row-padding">
        <div class="w3-col m12">
            <div class="w3-card-4 w3-round w3-signal-white">
                <div class="w3-container">
                    <h6 class="w3-opacity">The current path is as follows :</h6>
                    <p contenteditable="false" class="w3-col m12 w3-border w3-padding">
                        <i class="fa fa-arrow-right w3-left" aria-hidden="true" style="margin: 6px 6px 0 0"> ResourceSetter</i>
                        <i class="fa fa-arrow-right w3-left" aria-hidden="true" style="margin: 6px 6px 0 0"> JCSAgent</i>
                        <i class="fa fa-list-alt w3-button w3-right" title="Table List" aria-hidden="true"></i></button>
                        <i class="fa fa-list w3-button w3-right" title="Content List" aria-hidden="true"></i>
                        <i class="fa fa-plus w3-button w3-right" title="Add Agent" aria-hidden="true"></i>
                    </p>
                </div>
            </div>
        </div>
    </div>

    <div class="w3-container w3-card-4 w3-signal-white w3-round w3-margin" v-for="(content, index) in contentList"><br>
        <img src="/src/assets/images/resource_setter/Agent_128.png" alt="JCSAgent" class="w3-left w3-circle w3-margin-right" style="height:48px;width:48px">
        <span class="w3-right w3-opacity">{{ content.lastupdatetime }}</span>
        <p>{{ content.agentname }}</p>
        <span class="w3-tag w3-small w3-theme-l2" style="transform:rotate(-5deg)">{{ 'Host:' + content.host }}</span>
        <span class="w3-tag w3-small w3-theme-l3" style="transform:rotate(-5deg)">{{ 'Port:' + content.port }}</span>
        <span class="w3-tag w3-small w3-theme-l4" style="transform:rotate(-5deg)">{{ (content.activate == 1) ? 'activate' : 'Deactivate' }}</span>
        <span class="w3-tag w3-small w3-theme-l4" style="transform:rotate(-5deg)">{{ 'Max Jobs:' + content.maximumjob }}</span>
        <hr class="w3-border-black w3-clear">
        <p class="w3-small">{{ content.description }}</p>
        <button type="button" class="w3-button w3-theme-d1 w3-margin-bottom" @click="test(index)"><i class="fa fa-pencil"></i> Edit</button>
        <button type="button" class="w3-button w3-theme-d2 w3-margin-bottom" @click="test(index)"><i class="fa fa-trash-o"></i> Delete</button>
    </div>
</div>
</template>
<script>
import { HTTPRepo } from '../../axios/http-common'
import { mapGetters } from 'vuex'

export default {
    data() {
        return {
            objs: new Object(),
            editable: false
        }
    },
    computed: {
        //ES7的寫法
        ...mapGetters({
            contentList: 'getContent'
        })
    },
    mounted() {
        let params = {
            "number": 0,
            "size": 1
        }
        this.$store.dispatch('fetchAgentContent', params)
        // HTTPRepo.get(`jcsagent/findAll`)
        //     .then(response => {
        //         this.objs = response.data;
        //     })
        //     .catch(error => {
        //         if (error.response) {
        //             alert(error.response.data)
        //         } else {
        //             alert(error.message)
        //         }
        //     })
    },
    methods: {
        changeEditable(e){
            this.editable = !this.editable
            alert(this.editable)
        },
        test(index){
            let newContent = {
                "index": index,
                "agentname": "fuck name",
                "host": "fuck host",
                "port": "fuck port"
            }
            this.$store.dispatch('editAgentContent', newContent)
        }
    }
}
</script>

