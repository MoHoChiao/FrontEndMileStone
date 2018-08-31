<template>
    <modal-window v-if="this.windowAlive" :window-title="windowTitle" :window-bg-color="windowBgColor" @closeModalWindow="cancel">
        <role-form v-if="urlOp === 'add'" slot="content" ref="roleForm"></role-form>
        <role-form v-else slot="content" ref="roleForm" :content="content"></role-form>
        <div slot="footer">
            <form-button btn-color="signal-white" @cancel="cancel" @reset="reset" @save="save"></form-button>
        </div>
    </modal-window>
</template>
<script>
import { HTTP_TRINITY,errorHandle } from '../../../../util_js/axios_util'
import ModalWindow from '../../../Common/window/ModalWindow.vue'
import RoleForm from './RoleForm.vue'
import FormButton from '../../FormButton.vue'

export default {
    computed: {
        windowTitle(){
            if(this.urlOp === 'add')
                return 'Add Role'
            else if(this.urlOp === 'edit')
                return 'Edit Role - ' + this.content.rolename
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
        //store selected role
        content: {
            type: Object,
            default () {
                return {
                    roleuid: '',
                    rolename: '',
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
            let postContent = this.$refs.roleForm.save()

            let urlPath = ''
            if(this.urlOp === 'add'){   //新增Role
                urlPath = 'add'
            } else if(this.urlOp === 'edit'){   //編輯一筆已存在的Role
                urlPath = 'edit'
            } else {
                return
            }

            if(postContent){
                HTTP_TRINITY.post(`role/` + urlPath, postContent)
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
            this.$refs.roleForm.reset()
        }
    },
    components: {
        'modal-window': ModalWindow,
        'role-form': RoleForm,
        'form-button': FormButton
    }
}
</script>