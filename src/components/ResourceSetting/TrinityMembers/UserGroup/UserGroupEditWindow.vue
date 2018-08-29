<template>
    <modal-window v-if="this.windowAlive" :window-title="windowTitle" :window-bg-color="windowBgColor" @closeModalWindow="cancel">
        <user-group-form v-if="urlOp === 'add'" slot="content" ref="userGroupForm"></user-group-form>
        <user-group-form v-else slot="content" ref="userGroupForm" :content="content"></user-group-form>
        <div slot="footer">
            <form-button btn-color="signal-white" @cancel="cancel" @reset="reset" @save="save"></form-button>
        </div>
    </modal-window>
</template>
<script>
import { HTTP_TRINITY,errorHandle } from '../../../../util_js/axios_util'
import ModalWindow from '../../../Common/window/ModalWindow.vue'
import UserGroupForm from './UserGroupForm.vue'
import FormButton from '../../FormButton.vue'

export default {
    computed: {
        windowTitle(){
            if(this.urlOp === 'add')
                return 'Add User Group'
            else if(this.urlOp === 'edit')
                return 'Edit User Group - ' + this.content.groupname
        }  
    },
    props: {
        windowBgColor: {
            type: String,
            default: 'camo-black'
        },
        windowAlive: {
            type: Boolean,
            default: false
        },
        //store selected user group
        content: {
            type: Object,
            default () {
                return {
                    groupuid: '',
                    groupname: '',
                    description: ''
                }
            }
        },
        urlOp: {
            type: String,
            default: 'add'
        }
    },
    methods: {
        cancel(){
            if(this.urlOp === 'add')
                this.$emit('closeAdd')
            else if(this.urlOp === 'edit')
                this.$emit('closeEdit')
        },
        save(){
            let postContent = this.$refs.userGroupForm.save()

            let urlPath = ''
            if(this.urlOp === 'add' || this.urlOp === 'copy'){   //新增或複制一筆Agent
                urlPath = 'add'
            } else if(this.urlOp === 'edit'){   //編輯一筆已存在的Agent
                urlPath = 'edit'
            } else {
                return
            }

            if(postContent){
                HTTP_TRINITY.post(`user-group/` + urlPath, postContent)
                .then(response => {
                    if(this.urlOp === 'add'){ //add operation
                        this.$emit('closeAdd', response.data)
                    }else if(this.urlOp === 'edit'){    //edit operation
                        this.$emit('closeEdit', response.data)
                    }
                })
                .catch(error => {
                    errorHandle(this.$store, error)
                })
            }
        },
        reset(){
            this.$refs.userGroupForm.reset()
        }
    },
    components: {
        'modal-window': ModalWindow,
        'user-group-form': UserGroupForm,
        'form-button': FormButton
    }
}
</script>