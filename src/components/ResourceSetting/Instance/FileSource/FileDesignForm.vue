<template>
    <div class="w3-small w3-panel w3-card">
        <div class="w3-row w3-section">
            <div class="w3-col m12">
                <label>{{ $t('Form.Fs.PatternAndType') }}</label>
                <hr class="w3-border-black" style="padding:0px;margin:0px">
            </div>
        </div>
        <div class="w3-row-padding w3-section">
            <div class="w3-col m6">
                <span class="w3-text-red">*</span><label>{{ $t('Form.Fs.FileNamePattern') }}</label>
                <input name="filename" :class="[inputClassList.common, errors.has('filename')? inputClassList.invalid: '']"
                       v-validate="'required'" v-model="new_content.filename" type="text" maxlength="64" placeholder="">
            </div>
            <div class="w3-col m6">
                <span class="w3-text-red">*</span><label>{{ $t('Form.Fs.PatternRule') }}</label>
                <select class="w3-select w3-border w3-round" v-model="new_content.pattern" style="padding:0px">
                    <option value="1" selected>{{ $t('Form.Fs.FromBeginning') }}</option>
                    <option value="2">{{ $t('Form.Fs.FromEnd') }}</option>
                    <option value="3">{{ $t('Form.Fs.SpecifyPosition') }}</option>
                    <option value="4">{{ $t('Form.Fs.FullMatch') }}</option>
                </select>
            </div>
        </div>
        <div v-if="new_content.pattern === '3'" class="w3-row-padding w3-section">
            <div class="w3-col m6">
                <span class="w3-text-red">*</span><label>{{ $t('Form.Fs.StartPosition') }}</label>
                <input name="startposition" :class="[inputClassList.common, errors.has('startposition')? inputClassList.invalid: '']"
                       ref="startpos"
                       v-validate="'required|between:0,32767'" v-model="new_content.startposition" type="number" min="0" max="32767">
            </div>
            <div class="w3-col m6">
                <span class="w3-text-red">*</span><label>{{ $t('Form.Fs.EndPosition') }}</label>
                <input name="endposition" :class="[inputClassList.common, errors.has('endposition')? inputClassList.invalid: '']"
                       v-validate="'required|between:0,32767|isBigger:startpos'" v-model="new_content.endposition" type="number" min="0" max="32767">
            </div>
        </div>
        <div v-if="new_content.filetype === 'D'" class="w3-row-padding w3-section">
            <div class="w3-col m12">
                <span class="w3-text-red">*</span><label>{{ $t('Form.Fs.FileType') }}</label>
                <select class="w3-select w3-border w3-round" v-model="new_content.filetype" style="padding:0px">
                    <option value="D" selected>{{ $t('Form.Fs.RegularFile') }}</option>
                    <option value="C">{{ $t('Form.Fs.ControlFile') }}</option>
                </select>
            </div>
        </div>
        <div v-else class="w3-row-padding w3-section">
            <div class="w3-col m6">
                <span class="w3-text-red">*</span><label>{{ $t('Form.Fs.FileType') }}</label>
                <select class="w3-select w3-border w3-round" v-model="new_content.filetype" style="padding:0px">
                    <option value="D" selected>{{ $t('Form.Fs.RegularFile') }}</option>
                    <option value="C">{{ $t('Form.Fs.ControlFile') }}</option>
                </select>
            </div>
            <div class="w3-col m6">
                <span class="w3-text-red">*</span><label>{{ $t('Form.Fs.ImplClass') }}</label>
                <select class="w3-select w3-border w3-round" v-model="new_content.cfImpClass" style="padding:0px">
                    <template v-for="(info, index) in cfs">
                        <option v-if="index % 2 === 0 && cfs[index+1]" :value="cfs[index+1].value">{{ info.value }}</option>
                    </template>
                </select>
            </div>
        </div>
        <div class="w3-row w3-section">
            <div class="w3-col m12">
                <label>{{ $t('Form.Fs.CheckMode') }}</label>
                <hr class="w3-border-black" style="padding:0px;margin:0px">
            </div>
        </div>
        <div class="w3-row-padding w3-section">
            <div class="w3-col m6">
                <input class="w3-check" v-model="new_content.checkduplicate" type="checkbox">
                <label>{{ $t('Form.Fs.CheckDup') }}</label>
            </div>
            <div class="w3-col m6">
                <input class="w3-check" v-model="new_content.checksum" type="checkbox">
                <label>{{ $t('Form.Fs.CheckSum') }}</label>
            </div>
        </div>
        <div class="w3-row-padding w3-section">
            <div v-if="new_content.checkduplicate && new_content.filetype === 'C'" class="w3-col m6">
                <span class="w3-text-red">*</span><label>{{ $t('Form.Fs.FilterRule') }}</label>
                <select class="w3-select w3-border w3-round" v-model="new_content.filterduplicate" style="padding:0px">
                    <option value="0">{{ $t('Form.Fs.FilterOutAll') }}</option>
                    <option value="1" selected>{{ $t('Form.Fs.FilterOutDup') }}</option>
                </select>
            </div>
            <div v-if="new_content.checksum" class="w3-col m3">
                <span class="w3-text-red">*</span><label><span class="w3-hide-medium w3-hide-small">{{ $t('Form.Fs.CheckSum') }} </span>{{ $t('Form.Fs.FileExt') }}</label>
                <input name="checksumfe" :class="[inputClassList.common, errors.has('checksumfe')? inputClassList.invalid: '']"
                       v-validate="'required'" v-model="new_content.checksumfe" type="text" placeholder="">
            </div>
            <div v-if="new_content.checksum" class="w3-col m3">
                <span class="w3-text-red">*</span><label>{{ $t('Form.Fs.Algorithm') }}</label>
                <select class="w3-select w3-border w3-round" v-model="new_content.checksumalg" style="padding:0px">
                    <option value="M" selected>MD5</option>
                    <option value="S">SHA1</option>
                </select>
            </div>
        </div>
        <div class="w3-row w3-section">
            <div class="w3-col m12">
                <label>{{ $t('Form.Fs.FileSetting') }}</label>
                <hr class="w3-border-black" style="padding:0px;margin:0px">
            </div>
        </div>
        <div class="w3-row-padding w3-section">
            <div class="w3-col m6">
                <span class="w3-text-red">*</span><label>{{ $t('Form.Fs.MinAmountFiles') }}</label>
                <input name="minfile" :class="[inputClassList.common, errors.has('minfile')? inputClassList.invalid: '']"
                       v-validate="'required|between:0,32767'" v-model="new_content.minfile" type="number" min="0" max="32767">
            </div>
            <div class="w3-col m6">
                <span class="w3-text-red">*</span><label>{{ $t('Form.Fs.MaxAmountFiles') }}</label>
                <input name="maxfile" :class="[inputClassList.common, errors.has('maxfile')? inputClassList.invalid: '']"
                       v-validate="'required|between:0,32767'" v-model="new_content.maxfile" type="number" min="0" max="32767">
            </div>
        </div>
        <div class="w3-row-padding w3-section">
            <div class="w3-col m6">
                <span class="w3-text-red">*</span><label>{{ $t('Form.Fs.Timeout') }}</label>
                <input name="timeout" :class="[inputClassList.common, errors.has('timeout')? inputClassList.invalid: '']"
                       v-validate="'required|between:0,32767'" v-model="new_content.timeout" type="number" min="0" max="32767" placeholder="Minutes">
            </div>
            <div v-if="new_content.filetype === 'C'" class="w3-col m6">
                <span class="w3-text-red">*</span><label>{{ $t('Form.Fs.ControlFileAmountMode') }}</label>
                <select class="w3-select w3-border w3-round" v-model="new_content.datafilecountmode" style="padding:0px">
                    <option value="R" selected>{{ $t('Form.Fs.DataFile') }}</option>
                    <option value="C">{{ $t('Form.Fs.ControlFile') }}</option>
                </select>
            </div>
        </div>
        <div class="w3-row-padding w3-section">
            <div class="w3-col m5">
                <input class="w3-check" v-model="new_content.bypasszero" type="checkbox">
                <label>{{ $t('Form.Fs.SuccessIfNoFile') }}</label>
            </div>
            <div class="w3-col m7">
                <input class="w3-check" v-model="new_content.appendUid" type="checkbox">
                <label>{{ $t('Form.Fs.AppendTaskUidInFileName') }}</label>
            </div>
        </div>
        <div class="w3-row w3-section">
            <div class="w3-col m12">
                <label>{{ $t('Form.Fs.FTPSetting') }}</label>
                <hr class="w3-border-black" style="padding:0px;margin:0px">
            </div>
        </div>
        <div class="w3-row-padding w3-section">
            <div class="w3-col m6">
                <input class="w3-check" v-model="new_content.ftpget" type="checkbox">
                <label>{{ $t('Form.Fs.FTPGet') }}</label>
            </div>
            <div v-if="new_content.ftpget" class="w3-col m6">
                <input class="w3-check" v-model="new_content.sftp" type="checkbox">
                <label>SFTP</label>
            </div>
        </div>
        <div v-if="new_content.ftpget && !new_content.sftp" class="w3-row-padding w3-section">
            <div class="w3-col m6">
                <input class="w3-check" v-model="new_content.ftpbinary" type="checkbox">
                <label>{{ $t('Form.Fs.FTPBinaryMode') }}</label>
            </div>
            <div class="w3-col m6">
                <input class="w3-check" v-model="new_content.passive" type="checkbox">
                <label>{{ $t('Form.Fs.Passive') }}</label>
            </div>
        </div>
        <div v-if="new_content.ftpget" class="w3-row-padding w3-section" style="padding-top:10px">
            <div class="w3-col m6">
                <span class="w3-text-red">*</span><label>{{ $t('Form.Fs.FTPConn') }}</label>
                <select name="ftpconnectionuid" :class="[inputClassList.ftpconnectionuid, errors.has('ftpconnectionuid')? inputClassList.invalid: '']"
                        v-validate="'required'" v-model="new_content.ftpconnectionuid" style="padding:0px">
                    <option v-for="info in ftpConns" :value="info.connectionuid">{{ info.connectionname }}</option>
                </select>
            </div>
            <div class="w3-col m6">
                <span class="w3-text-red">*</span><label>{{ $t('Form.Fs.PostFTPAct') }}</label>
                <select class="w3-select w3-border w3-round" v-model="new_content.ftppostaction" style="padding:0px">
                    <option value="0" selected>{{ $t('Form.Fs.DoNothing') }}</option>
                    <option value="1">{{ $t('Form.Fs.MoveFileToAnotherDir') }}</option>
                    <option value="2">{{ $t('Form.Fs.DeleteFile') }}</option>
                </select>
            </div>
        </div>
        <div v-if="new_content.ftpget" class="w3-row-padding w3-section">
            <div class="w3-col m6">
                <span class="w3-text-red">*</span><label>{{ $t('Form.Fs.FTPRemoteDir') }}</label>
                <input name="ftpremotedir" :class="[inputClassList.common, errors.has('ftpremotedir')? inputClassList.invalid: '']"
                       v-validate="'required'" v-model="new_content.ftpremotedir" type="text" placeholder="">
            </div>
            <div v-if="new_content.ftppostaction === '1'" class="w3-col m6">
                <span class="w3-text-red">*</span><label>{{ $t('Form.Fs.FTPMoveDir') }}</label>
                <input name="ftpmovedir" :class="[inputClassList.common, errors.has('ftpmovedir')? inputClassList.invalid: '']"
                       v-validate="'required'" v-model="new_content.ftpmovedir" type="text" placeholder="">
            </div>
        </div>
    </div>
</template>
<script>
    import { HTTP_TRINITY, errorHandle } from '../../../../util_js/axios_util'

    export default {
        data() {
            return {
                inputClassList: {
                    common: 'w3-input w3-border',
                    ftpconnectionuid: ['w3-select', 'w3-border', 'w3-round'],
                    invalid: 'w3-pale-red'
                },
                new_content: {
                    /*
                        javascript object/array is copy by reference, so here can not be written 'new_content=this.content'.
                        To avoid parent content to be changed.
                    */
                    filename: this.content.filename,
                    pattern: this.content.pattern,
                    startposition: this.content.startposition,
                    endposition: this.content.endposition,
                    filetype: this.content.filetype,
                    cfImpClass: this.content.cfImpClass,
                    datafilecountmode: this.content.datafilecountmode,
                    checkduplicate: Number(this.content.checkduplicate),
                    filterduplicate: this.content.filterduplicate,
                    checksum: Number(this.content.checksum),
                    checksumalg: this.content.checksumalg,
                    checksumfe: this.content.checksumfe,
                    minfile: this.content.minfile,
                    maxfile: this.content.maxfile,
                    timeout: this.content.timeout,
                    bypasszero: Number(this.content.bypasszero),
                    appendUid: Number(this.content.appendUid),
                    ftpget: Number(this.content.ftpget),
                    sftp: Number(this.content.sftp),
                    ftpbinary: Number(this.content.ftpbinary),
                    passive: Number(this.content.passive),
                    ftpconnectionuid: this.content.ftpconnectionuid,
                    ftppostaction: this.content.ftppostaction,
                    ftpremotedir: this.content.ftpremotedir,
                    ftpmovedir: this.content.ftpmovedir,
                    checkrow: this.content.checkrow    //此值不知道作用, 似乎永遠都是0
                },
                cfs: [],    //store all Implementation Class and display name
                ftpConns: []    //store all FTP Connections
            }
        },
        created() {
            //this.$validator.extend('isBigger', (value, [otherValue]) => {
            //    return value - otherValue > 0;
            //}, {
            //    hasTarget: true
            //});
        },
        mounted() {
            //Fetch cfs objs is above
            HTTP_TRINITY.get(`disconfig/findByModule`, {
                params: {
                    module: 'filesource'
                }
            })
                .then(response => {
                    this.cfs = response.data
                })
                .catch(error => {
                    errorHandle(this.$store, error)
                })

            //Fetch ftp connection objs is above
            HTTP_TRINITY.get(`connection/findByType`, {
                params: {
                    type: 'F'
                }
            })
                .then(response => {
                    this.ftpConns = response.data
                })
                .catch(error => {
                    errorHandle(this.$store, error)
                })
        },
        props: {
            content: {
                type: Object,
                default() {
                    return {
                        filename: '',
                        pattern: '1',
                        startposition: 0,
                        endposition: 0,
                        filetype: 'D',
                        cfImpClass: 'com.netpro.filesource.ctrl.MatchFileSizeCtrlFileHandler',
                        datafilecountmode: 'R',
                        checkduplicate: 0,
                        filterduplicate: '1',
                        checksum: 0,
                        checksumalg: 'M',
                        checksumfe: '.checksum',
                        minfile: 1,
                        maxfile: 5,
                        timeout: 3,
                        bypasszero: 0,
                        appendUid: 0,
                        ftpget: 0,
                        sftp: 0,
                        ftpbinary: 0,
                        passive: 0,
                        ftpconnectionuid: '',
                        ftppostaction: '0',
                        ftpremotedir: '',
                        ftpmovedir: '',
                        checkrow: 0
                    }
                }
            },
            index: Number
        },
        methods: {
            async save() {
                await this.$validator.validateAll()

                if (this.errors.any()) {
                    return
                } else {
                    //檢查值是否為空或合法範圍
                    if (this.new_content.ftpget) {
                        //如果有勾選FTPGet時, 檢查輸入的FTP Connection是否合法
                        let isLegalUid = false
                        for (let index in this.ftpConns) {
                            if (this.ftpConns[index].connectionuid == this.new_content.ftpconnectionuid) {
                                isLegalUid = true
                            }
                        }
                        if (!isLegalUid)
                            this.new_content.ftpconnectionuid = ''
                    }

                    //如果不是選擇Specified Position時, 則startposition及endposition一律代回預設值
                    if (this.new_content.pattern != '3') {
                        this.new_content.startposition = 0
                        this.new_content.endposition = 0
                    }

                    //如果是選擇Regular Data時, 則cfImpClass及datafilecountmode一律代回預設值
                    if (this.new_content.filetype === 'D') {
                        this.new_content.datafilecountmode = 'R'
                        this.new_content.cfImpClass = 'com.netpro.filesource.ctrl.MatchFileSizeCtrlFileHandler'
                    }

                    //如果不勾選checkduplicate時, 則filterduplicate一定是0
                    if (!this.new_content.checkduplicate) {
                        this.new_content.filterduplicate = 0
                    }

                    //如果不勾選check sum時, 則checksumalg及checksumfe一律代回預設值
                    if (!this.new_content.checksum) {
                        this.new_content.checksumalg = 'M'
                        this.new_content.checksumfe = '.checksum'
                    }

                    //把所有true or false值的checkbox欄位轉換為數字
                    this.new_content.checkduplicate = Number(this.new_content.checkduplicate)
                    this.new_content.checksum = Number(this.new_content.checksum)
                    this.new_content.bypasszero = Number(this.new_content.bypasszero)
                    this.new_content.appendUid = Number(this.new_content.appendUid)
                    this.new_content.ftpget = Number(this.new_content.ftpget)
                    this.new_content.sftp = Number(this.new_content.sftp)
                    this.new_content.ftpbinary = Number(this.new_content.ftpbinary)
                    this.new_content.passive = Number(this.new_content.passive)

                    return this.new_content
                }
            },
            reset() {
                //reset value to initial
                this.new_content.filename = this.content.filename
                this.new_content.pattern = this.content.pattern
                this.new_content.startposition = this.content.startposition
                this.new_content.endposition = this.content.endposition
                this.new_content.filetype = this.content.filetype
                this.new_content.cfImpClass = this.content.cfImpClass
                this.new_content.datafilecountmode = this.content.datafilecountmode
                this.new_content.checkduplicate = this.content.checkduplicate
                this.new_content.filterduplicate = this.content.filterduplicate
                this.new_content.checksum = this.content.checksum
                this.new_content.checksumalg = this.content.checksumalg
                this.new_content.checksumfe = this.content.checksumfe
                this.new_content.minfile = this.content.minfile
                this.new_content.maxfile = this.content.maxfile
                this.new_content.timeout = this.content.timeout
                this.new_content.bypasszero = this.content.bypasszero
                this.new_content.appendUid = this.content.appendUid
                this.new_content.ftpget = this.content.ftpget
                this.new_content.sftp = this.content.sftp
                this.new_content.ftpbinary = this.content.ftpbinary
                this.new_content.passive = this.content.passive
                this.new_content.ftpconnectionuid = this.content.ftpconnectionuid
                this.new_content.ftppostaction = this.content.ftppostaction
                this.new_content.ftpremotedir = this.content.ftpremotedir
                this.new_content.ftpmovedir = this.content.ftpmovedir
                this.new_content.checkrow = this.content.checkrow    //此值不知道作用, 似乎永遠都是0
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