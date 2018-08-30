<template>
    <modal-window v-if="this.windowAlive" @closeModalWindow="cancel">
        <div slot="content">
            <div class="w3-row">
                <form enctype="multipart/form-data" novalidate>
                    <label>
                        <!--<i class="fa fa-upload w3-button w3-hover-none" title="Upload Files" aria-hidden="true"></i>-->
                        <input type="file" name="upload" 
                               @change="filesChange($event.target.name, $event.target.files); fileCount = $event.target.files.length"
                               accept=".xml" class="input-file" />
                    </label>
                </form>
            </div>
            <div class="w3-row">
                <textarea class="w3-col m12" style="resize:none" rows="15">XXX</textarea>
            </div>
        </div>
    </modal-window>
</template>

<script>
    import { HTTP_TRINITY, errorHandle } from '../../../util_js/axios_util'
    import ModalWindow from '../../Common/window/ModalWindow.vue'

    export default {
        data() {
            return {
                allOverlayLoading: false,    //control the status of all page overlay loading
                allOverlayLoadingText: 'Loading'    //control the status of all page overlay loading
            }
        },
        props: {
            windowAlive: {
                type: Boolean,
                default: false
            }
        },
        methods: {
            cancel() {
                this.$emit('eClose');
            },
            filesChange(fieldName, fileList) {
                // handle file changes
                var formData = new FormData()
                if (!fileList.length)
                    return;

                var fileName = fileList[0].name;
                if (fileName.toLowerCase().indexOf('.xml') === -1)
                    return;

                // append the files to FormData
                Array
                    .from(Array(fileList.length).keys())
                    .map(x => {
                        formData.append(fieldName, fileList[x], fileList[x].name);
                    });

                console.log(formData.get(fieldName));

                // preview it
                this.importLicense(fileName, formData);

                ////�M��file input���e, �����i�H�A����ܬۦP���ɮצW��
                //let input = document.getElementById("DriverInputFile")
                //input.value = ''
            },
            importLicense(fileName, formData) {
                this.allOverlayLoadingText = 'Import license - ' + fileName + '...'
                this.allOverlayLoading = true

                HTTP_TRINITY.post(`pluginlicense/importPluginLicense`, formData)
                    .then(response => {
                        this.allOverlayLoading = false

                        console.log(response.data)
                    })
                    .catch(error => {
                        this.allOverlayLoading = false
                        this.getDrivers()
                        errorHandle(this.$store, error)
                    });
            },
        },
        components: {
            'modal-window': ModalWindow
        }
    }
</script>