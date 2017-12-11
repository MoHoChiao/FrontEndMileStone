<template>
    <modal-window v-if="this.windowAlive" :window-title="windowTitle" :window-bg-color="windowBgColor" @closeModalWindow="cancel">
        <connection-form v-if="urlOp === 'add'" slot="content" ref="connectionForm"></connection-form>
        <connection-form v-else slot="content" ref="connectionForm" :content="content" :urlOp="urlOp"></connection-form>
        <div slot="footer">
            <form-button btn-color="signal-white" @cancel="cancel" @reset="reset" @save="save"></form-button>
        </div>
        
    </modal-window>
</template>
<script>
import { HTTPRepo } from '../../../../axios/http-common'
import ModalWindow from '../../../Common/window/ModalWindow.vue'
import ConnectionForm from './ConnectionForm.vue'
import FormButton from '../../FormButton.vue'

export default {
    computed: {
        windowTitle(){
            if(this.urlOp === 'add')
                return 'Add Connection'
            else if(this.urlOp === 'edit')
                return 'Edit Connection'
            else if(this.urlOp === 'copy')
                return 'Copy Connection'
            else if(this.urlOp === 'move')
                return 'Move Connection'
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
        content: {
            type: Object,
            default () {
                return {
                    connectionuid: '',
                    connectionname: '',
                    description: '',
                    connectiontype: 'D',
                    pimendpointtype: '',
                    pimendpointname: '',
                    pimaccountcontainer: '',
                    pimaccountname: '',
                    withpim: '0',
                    userid: '',
                    server: '',
                    password: '',
                    targetdir: '',
                    jdbc_dbType: 'AS400',
                    jdbc_url: 'jdbc:as400://host/libname',
                    jdbc_driver: 'com.ibm.as400.access.AS400JDBCDriver',
                    host: '',
                    port: 25,
                    mailssl: '0',
                    mailtls: '0',
                    user: '',
                    notesHostIP: '',
                    notesIor: '',
                    notesServerName: '',
                    notesDBName: '',
                    SAPLANGUAGE: '',
                    sapSystemNumber: '',
                    sapSystemName: '',
                    sapHostIP: '',
                    sapCodePage: '',
                    sapClient: '',
                }
            }
        },
        selectedCategoryRecord: {
            type: Object,
            default () {
                return {
                    conncategoryuid: '',
                    conncategoryname: '',
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
            else if(this.urlOp === 'copy'){
                this.$emit('closeCopy')
            }else if(this.urlOp === 'move')
                this.$emit('closeMove')
        },
        save(){
            let postContent = this.$refs.connectionForm.save()

            let urlPath = ''
            if(this.urlOp === 'add'){   //新增一筆connection
                if(this.selectedCategoryRecord && this.selectedCategoryRecord.conncategoryuid && 
                        this.selectedCategoryRecord.conncategoryuid !== ''){  //在某個connection category底下新增一筆connection
                    urlPath = this.urlOp + '?categoryUid=' + this.selectedCategoryRecord.conncategoryuid
                }else{  //在root位置新增一筆connection
                    urlPath = this.urlOp
                }
            } else if(this.urlOp === 'edit'){   //編輯一筆已存在的connection
                urlPath = this.urlOp
            } else if(this.urlOp === 'copy'){   //複制一筆已存在的connection, 到某個connection category底下
                /*
                 * 寫死add方法,因為其實copy就等於是add方法的行為
                 * 沒有回傳conncategoryuid則表示是在root底下新增connection, 此時urlPath只需'add'路徑
                */
                if(postContent){    //如果有必填的欄位沒填或不合法, 會回傳undefined回來, 因此這裡需要判斷一下
                    if(postContent.conncategoryuid && postContent.conncategoryuid.trim().length > 0)    //當conncategoryuid有值, 表示有選擇某一個category
                        urlPath = 'add?categoryUid=' + postContent.conncategoryuid
                    else    //如果選擇'/'表示根目錄, 只需要add即可
                        urlPath = 'add'
                }
            } else if(this.urlOp === 'move'){   //移動一筆已存在的connection, 到某個connection category底下
                /*
                 * 寫死edit方法,因為其實move就等於是edit方法的行為
                 * 沒有回傳conncategoryuid則表示是把connection移動到root底下, 此時urlPath只需'edit'路徑
                */
                if(postContent){    //如果有必填的欄位沒填或不合法, 會回傳undefined回來, 因此這裡需要判斷一下
                    if(postContent.conncategoryuid && postContent.conncategoryuid.trim().length > 0)    //當conncategoryuid有值, 表示有選擇某一個category
                        urlPath = 'edit?categoryUid=' + postContent.conncategoryuid
                    else    //表示選擇'/'表示根目錄, categoryUid代為空字串
                        urlPath = 'edit?categoryUid='
                }
            }else {
                return
            }
            
            if(postContent){
                HTTPRepo.post(`connection/` + urlPath, postContent)
                .then(response => {
                    if(this.urlOp === 'add'){ //add operation
                        this.$emit('closeAdd', response.data)
                    }else if(this.urlOp === 'edit'){    //edit operation
                        this.$emit('closeEdit', response.data)
                    }else if(this.urlOp === 'copy'){  //copy operation
                        this.$emit('closeCopy', postContent.conncategoryuid, response.data)
                    }else if(this.urlOp === 'move'){  //move operation
                        this.$emit('closeMove', postContent.conncategoryuid, response.data)
                    }
                })
                .catch(error => {
                    if (error.response && error.response.data) {
                        let newStatus = {
                            "msg": error.response.data,
                            "status": "Error"
                        }
                        this.$store.dispatch('setSystemStatus', newStatus)
                    } else {
                        let newStatus = {
                            "msg": error.message,
                            "status": "Error"
                        }
                        this.$store.dispatch('setSystemStatus', newStatus)
                    }
                })
            }
        },
        reset(){
            this.$refs.connectionForm.reset()
        }
    },
    components: {
        'modal-window': ModalWindow,
        'connection-form': ConnectionForm,
        'form-button': FormButton
    }
}
</script>