<template>
    <modal-window v-if="this.windowAlive" :window-title="windowTitle" :window-bg-color="windowBgColor" @closeModalWindow="cancel">
        <frequency-form v-if="urlOp === 'add'" slot="content" ref="frequencyForm" @save="save"></frequency-form>
        <frequency-form v-else slot="content" ref="frequencyForm" :content="content" :urlOp="urlOp" @save="save"></frequency-form>
        <div slot="footer">
            <form-button btn-color="signal-white" @cancel="cancel" @reset="reset" @save="picked"></form-button>
        </div>
        
    </modal-window>
</template>
<script>
import { HTTPRepo,errorHandle } from '../../../../util_js/axios_util'
import ModalWindow from '../../../Common/window/ModalWindow.vue'
import FrequencyForm from './FrequencyForm.vue'
import FormButton from '../../FormButton.vue'

export default {
    computed: {
        windowTitle(){
            if(this.urlOp === 'add')
                return 'Add Frequency'
            else if(this.urlOp === 'edit')
                return 'Edit Frequency'
            else if(this.urlOp === 'copy')
                return 'Copy Frequency'
            else if(this.urlOp === 'move')
                return 'Move Frequency'
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
                    frequencyuid: '',
                    frequencyname: '',
                    description: '',
                    activate: '0',
                    manuallyedit: '0',
                    bywcalendar: '0',
                    wcalendaruid: ''
                }
            }
        },
        selectedCategoryRecord: {
            type: Object,
            default () {
                return {
                    freqcategoryuid: '',
                    freqcategoryname: '',
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
        picked(){
            this.$refs.frequencyForm.picked()
        },
        save(postContent){
            let urlPath = ''
            if(this.urlOp === 'add'){   //新增一筆connection
                if(this.selectedCategoryRecord && this.selectedCategoryRecord.freqcategoryuid && 
                        this.selectedCategoryRecord.freqcategoryuid !== ''){  //在某個connection category底下新增一筆connection
                    urlPath = this.urlOp + '?categoryUid=' + this.selectedCategoryRecord.freqcategoryuid
                }else{  //在root位置新增一筆connection
                    urlPath = this.urlOp
                }
            } else if(this.urlOp === 'edit'){   //編輯一筆已存在的connection
                urlPath = this.urlOp
            } else if(this.urlOp === 'copy'){   //複制一筆已存在的connection, 到某個connection category底下
                /*
                 * 寫死add方法,因為其實copy就等於是add方法的行為
                 * 沒有回傳freqcategoryuid則表示是在root底下新增connection, 此時urlPath只需'add'路徑
                */
                if(postContent){    //如果有必填的欄位沒填或不合法, 會回傳undefined回來, 因此這裡需要判斷一下
                    if(postContent.freqcategoryuid && postContent.freqcategoryuid.trim().length > 0)    //當freqcategoryuid有值, 表示有選擇某一個category
                        urlPath = 'add?categoryUid=' + postContent.freqcategoryuid
                    else    //如果選擇'/'表示根目錄, 只需要add即可
                        urlPath = 'add'
                }
            } else if(this.urlOp === 'move'){   //移動一筆已存在的frequency, 到某個frequency category底下
                /*
                 * 寫死edit方法,因為其實move就等於是edit方法的行為
                 * 沒有回傳freqcategoryuid則表示是把frequency移動到root底下, 此時urlPath只需'edit'路徑
                */
                if(postContent){    //如果有必填的欄位沒填或不合法, 會回傳undefined回來, 因此這裡需要判斷一下
                    if(postContent.freqcategoryuid && postContent.freqcategoryuid.trim().length > 0)    //當freqcategoryuid有值, 表示有選擇某一個category
                        urlPath = 'edit?categoryUid=' + postContent.freqcategoryuid
                    else    //表示選擇'/'表示根目錄, categoryUid代為空字串
                        urlPath = 'edit?categoryUid='
                }
            }else {
                return
            }
            
            if(postContent){
                HTTPRepo.post(`frequency/` + urlPath, postContent)
                .then(response => {
                    if(this.urlOp === 'add'){ //add operation
                        this.$emit('closeAdd', response.data)
                    }else if(this.urlOp === 'edit'){    //edit operation
                        this.$emit('closeEdit', response.data)
                    }else if(this.urlOp === 'copy'){  //copy operation
                        this.$emit('closeCopy', postContent.freqcategoryuid, response.data)
                    }else if(this.urlOp === 'move'){  //move operation
                        this.$emit('closeMove', postContent.freqcategoryuid, response.data)
                    }
                })
                .catch(error => {
                    errorHandle(this.$store, error)
                })
            }
        },
        reset(){
            this.$refs.frequencyForm.reset()
        }
    },
    components: {
        'modal-window': ModalWindow,
        'frequency-form': FrequencyForm,
        'form-button': FormButton
    }
}
</script>