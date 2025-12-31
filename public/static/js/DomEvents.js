import DomActions from './DomActions.js';
import loadComponentsContainer from './ComponentsContainer.js';
import SourceCodeSection from './DocumentSection.js';

export default class DomEvents {
    components_list = [];
    active_component_dialog_elements = [];
    _triggerClick(selector) {
        $(selector).click();
    }
    _button_clicks() {
        /*initial clicks for file*/
        let self = this;
        setTimeout(function() {

            $($('.ui.tabular.menu').children().get(0)).click()
            $($('.folder-section')[0]).hide().click();
            $($('.individual-search')[0]).click();
            //            ($('.file-click')[0]).click();
            self.tsp.DetailsPanel.close_details();
            $('#sidenav-button-id1').click();
            self.tsp.loadComponentsContainer.split_and_full_screen_UI();
            self.tsp.GlobalConstants.current_window = 1; //golbal declaration
            $('#close-editor-button').addClass('top-header-highlighter').click();
            setTimeout(function() {
                $('#open-close-overlay').click();
                $('#sidenav-button-id1').click();
            }, 200)
            $('#stream-youtube-video').click();
            self._triggerClick('#main-section-button');

        }, 1500);




        /*password validate for drowssap
            $('#password-validate-dialog').dialog({
                autoOpen: false,
                width:'90%',
                height:'700'
            });*/
        /*close File container*/
        //$('#close-component-results-container').click();
        
        // self.online_checker();
    }
    online_checker(){
        let should_show_notifaction = false;
        setInterval( ()=>{
            let def = $.Deferred();
            $.get({
                url: self.tsp.GlobalConstants.online_status_check_url,
                cache: false
            }).done((res)=>{
                // console.log("response..............success");
                if(should_show_notifaction){
                    self.tsp.NotificationBar.launch_notification(self.tsp.GlobalConstants.online_status,  '', '', 5000);
                    should_show_notifaction = false;
                }
                def.resolve();
            }).fail((e)=>{
                // console.log("failed to get............failure.");
                self.tsp.NotificationBar.launch_notification(self.tsp.GlobalConstants.offline_status, '', '', 20000);
                should_show_notifaction = true;
                def.reject();
            });
            def.promise();
        }, 10000);
    }
    static _get_action_object() {
        return new DomActions()
    }
    static _get_components_container_object() {
        return new loadComponentsContainer()
    }


    _initialize_tool_tips() {
        $('[data-toggle="tooltip"]').tooltip();
    }
    search_box_clear_util() {
        switch (self.tsp.GlobalConstants.current_window) {
            case 1:
            case 3:
                {
                    $('.search-container  .prompt').val('').focus();
                    self.tsp.loadComponentsContainer.callSearchResults("");
                    break;

                }
            case 2:
                {
                    $('#searchInput  .prompt').val('').focus();
                    //self.tsp.loadComponentsContainer.callSearchResults();
                    break;
                }
        }
    }
    search_box_clear() {
        $('.ui.close.icon').on('click', function() {
            self.search_box_clear_util();
        });
    }


    _download_video_click_event() {
        /*download youtube video*/
        self = this;
        $('#download-video-button').on('click', function() {
            self.action_obj.download_video_click_action();
        });
    }

    _create_event_listeners_for_dragbar() {
        const bar = $('.split__bar');
        const left_part = $('.split__left');
        const right_part = $('#parent-source-code-main-div');
        let self = this;
        self.mouse_is_down = false;
        const split_bar_width = 3;
        bar.on('mousedown', function(e) {
            $('#display-tab-setting-backdrop').show()
            $(this).css({
                'width': split_bar_width
            });
            self.mouse_is_down = true;
        });

        $(document).on('mousemove', (e) => {
            let header_width = $('#top-header').width();
            let screenWidth = screen.width;
            let q1 = screenWidth - parseInt(`${e.clientX}px`);
            let q2 = parseInt(`${e.clientX}px`);
            if (!self.mouse_is_down || q2 >= (screenWidth / 2)) return;
            left_part.css('width', q2 - 53);
            right_part.css('width', q1 - header_width + 50); // +50 is for top-header
            right_part.css('left', q2 - header_width);
            bar.css('left', q2 - header_width - split_bar_width);
        })

        document.addEventListener('mouseup', () => {
            self.mouse_is_down = false;
            $('#display-tab-setting-backdrop').hide()
        })
    }




    _initialize_local_video_Stream() {
        (function localFileVideoPlayer() {
            'use strict'
            var URL = window.URL || window.webkitURL
            var displayMessage = function(message, isError) {
                var element = document.querySelector('#message')
                element.innerHTML = message
                element.className = isError ? 'error' : 'info'
            }
            var playSelectedFile = function(event) {
                var file = this.files[0]
                var type = file.type
                var videoNode = document.getElementById('local-stream-video-node')
                var canPlay = videoNode.canPlayType(type)
                if (canPlay === '') canPlay = 'no'
                var message = 'Can play type "' + type + '": ' + canPlay
                var isError = canPlay === 'no'
                displayMessage(message, isError)

                if (isError) {
                    return
                }

                var fileURL = URL.createObjectURL(file)
                videoNode.src = fileURL;

                videoNode.style.width = '400px';
                videoNode.style.height = '300px';
            }
            var inputNode = document.getElementById('local-stream')
            inputNode.addEventListener('change', playSelectedFile, false);

            //          $('#local-stream').on('change', function(){
            //            playSelectedFile();
            //          });
        })()
    }

    keyboard_events() {
        let self = this;
        // When the user clicks anywhere outside of the modal, close it

        $(document).on('keypress keydown', function(e) {
            if (self.tsp.current_window === undefined)
                self.tsp.current_window = 1;
            switch (self.tsp.current_window) {
                case 1:
                case 3:
                    {
                        if ((e.which === 9 || e.eyCode === 9) && ($('#quick-file-editor').is(':focus'))) {
                            e.preventDefault();
                            var start = e.target.selectionStart;
                            var end = e.target.selectionEnd;

                            // set textarea value to: text before caret + tab + text after caret
                            e.target.value = e.target.value.substring(0, start) +
                                "\t" + e.target.value.substring(end);

                            // put caret at right position again
                            e.target.selectionStart =
                                e.target.selectionEnd = start + 1;

                        }
                        if (e.keyCode === 27) { //ESC
                            $('#modal-id').hide();
                            self.search_box_clear_util();
                        } else if (!e.ctrlKey || !e.shiftKey)
                            return;

                        if (e.keyCode === 78 || e.keyCode === 187) { // ctrl + shift + N
                            e.preventDefault();
                            self.tsp.loadComponentsContainer.action_function_map.create_new_file();
                        } else if (e.keyCode === 46) { //ctrl + shift + DELETE
                            e.preventDefault();
                            self.tsp.loadComponentsContainer._delete_file_in_the_backend();
                        } else if (e.keyCode === 82) { //ctrl + shift + R
                            e.preventDefault();
                            self.tsp.loadComponentsContainer._build_rename_field_and_call_backend();
                        } else if (e.keyCode === 70) { //ctrl + shift + F
                            e.preventDefault();
                            self.tsp.loadComponentsContainer._mark_favourite_in_the_backend();
                        } else if (e.keyCode === 72) { //ctrl + shift + H
                            e.preventDefault();
                            self.tsp.Dialog.launch_dialog('video-notes-help-dialog');
                        } else if (e.keyCode === 73) { //shift + I
                            e.preventDefault();
                            if ($('#right-side-panel').is(':visible'))
                                self.tsp.DetailsPanel.close_details();
                            else {
                                self.tsp.DetailsPanel.launch_quick_file_details_data(self.tsp.loadComponentsContainer.curr_file_uuid);
                                self.tsp.DetailsPanel.open_details();
                            }
                        }
                        //  else if (e.keyCode === 70) { //ctrl + F
                        //     e.preventDefault();
                        //     $('.search-container  .prompt').val('').focus();

                        // }



                        break;
                    }
                case 2:
                    {
                        if (e.keyCode === 27) {
                            $('#modal-id').hide();
                        }
                        break;
                    }
            }
        });



        $('input').keypress(function(e) {
            let target_id = e.target.id;

            if (e.keyCode === 13) {
                if (target_id === "create-file-text-box") {
                    self.tsp.loadComponentsContainer.action_function_map.create_new_file_submit_btn();
                }
            }
        });

    }
    global_logout_event() {
        let self = this;
        $('#user-name-section').on('click', function() {
            /* self.tsp.FireBase.logout();
            this function is moved to Header.js as menu() */
            $(this).contextmenu();
        });

    }
    prompt_before_refresh() {
        window.addEventListener("beforeunload", function(e) {
            var confirmationMessage = "\o/";

            (e || window.event).returnValue = confirmationMessage; //Gecko + IE
            return confirmationMessage; //Webkit, Safari, Chrome
        });
    }
    load_common_settings_in_DOM(common_setting_data) {
        $('#youtube-video-link').val(common_setting_data['youtube_url']);
    }
    load_common_setting_from_firebase() {
        let self = this;
        let def_obj = $.Deferred();
        self.tsp.QuickNoteFirebase.read_common_setting_file().then((common_setting_data) => {
            self.tsp.GlobalConstants.common_setting_data = common_setting_data;
            self.load_common_settings_in_DOM(common_setting_data);
            return def_obj.resolve();
        });
        return def_obj.promise();
    }
    init(tsp, label_map) {
        this.tsp = tsp;
        this.label_map = label_map;
        let self = this;
        let def_obj = $.Deferred();
        tsp.DomEvents = this;
        this.action_obj = new DomActions();
        this.load_common_setting_from_firebase().then(() => {
            this._download_video_click_event();
            this._initialize_tool_tips();
            this._create_event_listeners_for_dragbar();
            //        this._initialize_local_video_Stream();
            this._button_clicks();
            this.keyboard_events();
            this.global_logout_event();
            // this.prompt_before_refresh();
            // this.search_box_clear();
            def_obj.resolve(tsp, label_map);
        });
        return def_obj.promise();
    }

}