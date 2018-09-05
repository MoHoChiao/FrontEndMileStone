<template>
    <modal-window v-if="this.windowAlive" :window-title="windowTitle" :window-bg-color="windowBgColor" @closeModalWindow="cancel">
        <user-form v-if="urlOp === 'add'" slot="content" ref="userForm"></user-form>
        <user-form v-else slot="content" ref="userForm" :content="content"></user-form>
        <div slot="footer">
            <form-button btn-color="signal-white" @cancel="cancel" @reset="reset" @save="save"></form-button>
        </div>
    </modal-window>
</template>
<script>
import { HTTP_TRINITY,errorHandle } from '../../../../util_js/axios_util'
import ModalWindow from '../../../Common/window/ModalWindow.vue'
import UserForm from './UserForm.vue'
import FormButton from '../../FormButton.vue'

export default {
    computed: {
        windowTitle(){
            if(this.urlOp === 'add')
                return 'Add User'
            else if(this.urlOp === 'edit')
                return 'Edit User - ' + this.content.username
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
                    useruid: '',
                    userid: '',
                    username: '',
                    description: '',
                    usertype: 'G',
                    activate: '1',
                    localaccount: '0',
                    onlyforexecution: '0',
                    email: '',
                    mobile: '',
                    defaultlang: 'en_US',
                    ssoid: '',
                    homedir: '',
                    createduseruid: ''
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
            let postContent = this.$refs.userForm.save()

            let urlPath = ''
            if(this.urlOp === 'add'){   //新增Group
                urlPath = 'add'
            } else if(this.urlOp === 'edit'){   //編輯一筆已存在的Group
                urlPath = 'edit'
            } else {
                return
            }

            if(postContent){
                HTTP_TRINITY.post(`trinity-user/`+ urlPath, postContent)
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
            this.$refs.userForm.reset()
        }
    },
    components: {
        'modal-window': ModalWindow,
        'user-form': UserForm,
        'form-button': FormButton
    }
}
</script>