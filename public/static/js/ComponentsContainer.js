import DomEvents from './DomEvents.js';


export default class loadComponentsContainer {

    cache_elements() {
        let self = this;
        self.search_box = $('#search-box');
        self.close_results_icon = $('.search-box-icons > .icon.close');
        self.close_youtube_text = $('.youtube-video-link-close');
        self.youtube_txt_box = $('#youtube-video-link');
        /*local constants */
        self.left_and_middle_section = 315;
        // self.editor = $('#quick-file-editor'); //$($('.note-editable')[0]);

    }

    get_text_editor_content() {
        let self = this;
        // self.summer_note_ele = document.getElementById('quick-file-editor').contentWindow.document.getElementsByClassName('note-editable')[0];
        // return self.summer_note_ele.innerHTML;
        return $('#quick-file-editor').val();
        // return $("#quick-file-editor").summernote('code');
    }

    set_text_editor_content(content) {
        let self = this;
        // document.getElementById('quick-file-editor').contentWindow.document.getElementsByClassName('note-editable')[0].innerHTML = content;
        // $($('.note-editable')[0]).html(content);
        // $("#quick-file-editor").summernote('code', content); 
        $('#quick-file-editor').val(content);
    }

    initialize_summernote_for_quick_note() {
        let self = this;
        $('.note-editor').remove();
        let addCheckList = function(context) {
            var ui = $.summernote.ui;
            var button = ui.button({
                contents: '<i class="fa fa-check-square-o"/>',
                tooltip: 'Insert a Checklist',
                click: function() {
                    context.invoke('editor.pasteHTML', '<span contentEditable="false"><input type="checkbox" class="note-editor-checkbox"/></span>&nbsp;');

                }
            });
            return button.render();
        }
        $('#quick-file-editor').summernote({
            height: self.tsp.GlobalConstants.window_height, // set editor height
            maxHeight: null, // set maximum height of editor
            focus: true, // set focus to editable area after initializing summernote
            disableResizeEditor: true,
            tabsize: 2,
            toolbar: [
                ['style', ['style']],
                ['font', ['bold', 'underline', 'clear']],
                ['color', ['color']],
                ['para', ['ul', 'ol', 'paragraph']],
                // ['table', ['table']],
                // ['insert', ['link', 'picture', 'video']],
                // ['view', ['help']],
                // ['misc', ['undo', 'redo']],
                // ['customOptions', ['AddCheckList']],
            ],
            buttons: {
                AddCheckList: addCheckList
            },
            callbacks: {
                onChange: function(contents, $editable) {
                    self.action_function_map['save_file_if_changed']();
                    self.update_file_content_while_typing(self.curr_file_uuid, contents);
                }
            }
        });
    }

    _get_file_html(uuid) {
        let self = this;
        let html = `<div class='individual-search card' id='${uuid}'>`;
        html += `<span class='search-result-item' >${self.label_map[uuid].name}</span></div>`;
        return html;
    }

    build_individual_searchresult(uuid, file_content) {
        let self = this;
        let ret_json = self.label_map[uuid]
        let content = "";
        let star_icon_html = ``;
        // let date = new Date(ret_json.last_updated);
        let last_updated = self.tsp.Utils.get_formatted_date(ret_json.last_updated);

        if (file_content !== undefined)
            content = file_content;
        else {
            content = self.label_map[uuid].content;
        }

        if (self.label_map[uuid].starred == "true") {
            star_icon_html = `<i class='icon star common-icon'> </i>`
        }
        let html = `<div class='individual-search card' id="${uuid}">
                        <div class="individual-search-level-1" title="${ret_json.name}">
                            <span class='search-result-item'>
                                ${ret_json.name}
                            </span>
                            <span>
                                ${star_icon_html}
                            </span>
                        </div>
                        <div class="individual-search-result-metadata">
                            <div class="individual-search-file-content">
                                ${content}
                            </div>
                            <a class="item" title="Last updated">
                                <div class="ui horizontal label">${last_updated}</div>
                            </a>
                        </div>
                    </div>`;
        return html;
    }

    split_and_full_screen_UI() {
        let self = this;
        let classList = $("#right-side-components").attr('class');

        if (classList.indexOf('right-side-components-full-screen') >= 0) {
            $("#right-side-components").removeClass('right-side-components-full-screen');
            $("#right-side-components").addClass('right-side-components-split-screen');
            $('.file-factory-split-bar').css('left', self.left_and_middle_section - 7);
            $('#left-and-middle-section').css('width', self.left_and_middle_section);
            $('#left-and-middle-section').show();
            $('.sidenav-button-content-class')[0].classList.remove('right');
            $('.sidenav-button-content-class')[0].classList.add('left');

        } else {
            $("#right-side-components").removeClass('right-side-components-split-screen');
            $("#right-side-components").addClass('right-side-components-full-screen');
            $('.file-factory-split-bar').css('left', '20px');
            $('#left-and-middle-section').hide();
            $('.sidenav-button-content-class')[0].classList.remove('left');
            $('.sidenav-button-content-class')[0].classList.add('right');
            // self.click_side_nav_button();

        }
    }

    sort_files_by_name_and_update_UI() {
        let self = this;
        let file_elems = $('.individual-search')

        let uuid_arr = Object.keys(self.label_map);
        uuid_arr.sort(function(a, b) {
            var textA = self.label_map[a].name.toLowerCase();
            var textB = self.label_map[b].name.toLowerCase();
            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
        });
        $('#file-middle-section').empty();
        //        for(let uuid in self.label_map){
        //            console.log(uuid)
        //            $('#file-middle-section').append($(file_elems[i]));
        //        }
        for (let i = 0; i < uuid_arr.length; i++) {
            let uuid = uuid_arr[i];
            // console.log(self.label_map[uuid].name)
            //            $($(file_elems[i]).get(0)).find('.icon.star').remove();
            let html = self.build_individual_searchresult(uuid);
            $('#file-middle-section').append($(html));
            self.update_starred_files_with_icon(uuid);
        }

        self.events_map['individual-search']();
    }

    _file_switch_action_function(target) {
        let self = this;
        if (self.tsp.GlobalConstants.current_window === 3) {
            if (target.id == "sidenav-button-id1")
                self.split_and_full_screen_UI();
            return;
        }
        $('.quick-notes-top-section').show();
        self.active_switch = "file-switch";

        $('.video-stream-back-to-file-list').hide();
        $('#component-factory-title').hide();
        $('#right-side-section').hide();
        // let component_factory_icon_elems = $('.component-factory-left-icons');
        // let len = component_factory_icon_elems.length;
        // for (let i = 0; i < len; i++) {
        //     let class_list = $(component_factory_icon_elems[i]).attr('class').split(' ');
        // }

        $('#middle-section').show();
        let file_editor = $('#quick-notes-in-file-factory').clone();
        $('#quick-notes-in-file-factory').remove();
        $('#video-stream-in-file-factory').hide();

        $('#left-and-middle-section').css({ 'width': self.left_and_middle_section });
        let file_editor_obj = $(file_editor).removeClass('text-editor-in-middle-section').addClass('text-editor-in-right-side-components');
        $('#right-side-components-container').append(file_editor_obj);
        // self.initialize_summernote_for_quick_note();
        self.fillRightSideComponents(self.curr_file_uuid);

        if (!$('#right-side-components').hasClass('right-side-components-full-screen')) {
            $("#right-side-components").css({
                'left': self.left_and_middle_section,
                'width': `calc(100% - ${"280px"})`
            });
            $('.file-factory-split-bar').css('left', self.left_and_middle_section);
        }
        self._build_file_factory_options();
        // self._open_settings();   
        self.action_function_map['switch_class_for_quick_notes_filename']();







        if (self.tsp.GlobalConstants.previous_window != 1) {
            self.tsp.GlobalConstants.previous_window = 1;
        } else {
            self.split_and_full_screen_UI();
        }

    }

    click_side_nav_button() {
        let self = this;
        if (self.tsp.GlobalConstants.window_width <= 450) {
            // $('#sidenav-button-id1').click();
            self._file_switch_action_function(($('#sidenav-button-id1')));
        }
    }

    _video_switch_action_function() {
        let self = this;
        // if (self.tsp.GlobalConstants.previous_window != 3) {
        //     self.tsp.GlobalConstants.previous_window = 3;
        // } else {
        //     self.split_and_full_screen_UI();
        // }
        // $('.individual-search').get(0).click();
        $('.video-stream-back-to-file-list').show();
        $('.quick-notes-top-section').hide();
        //                $('#components-search-container').css({'top':'35px',
        //                                                    'height':' calc( 100% - 36px)'
        //                                                  });
        $('#component-factory-title').show();

        $('#pane').css({ 'display': 'block' });
        $('#right-side-section').show();
        // let component_factory_icon_elems = $('.component-factory-left-icons');
        // let len = component_factory_icon_elems.length;
        // for (let i = 0; i < len; i++) {
        //     let class_list = $(component_factory_icon_elems[i]).attr('class').split(' ');
        //     if (class_list.indexOf('active') >= 0) {
        //         $(component_factory_icon_elems[i]).removeClass('active');
        //         break;
        //     }
        // }

        self.active_switch = "video-stream-switch";

        let file_editor = $('#quick-notes-in-file-factory').clone();
        $('#quick-notes-in-file-factory').remove();
        $('#middle-section').show();
        let file_editor_obj = $(file_editor).removeClass('text-editor-in-right-side-components').addClass('text-editor-in-middle-section').hide();
        $('#left-and-middle-section').append($(file_editor_obj));


        self.fillRightSideComponents(self.curr_file_uuid);
        self.action_function_map['switch_class_for_video_notes_filename']();
        $('#video-stream-in-file-factory').css('display', 'block');
        //                $('#file-name').off('click');

        //                self.fillRightSideComponents(self, $('#file-name').text().trim() + '.txt');
        self.events_map['individual-search']();
        // if (self.active_switch == )
        // self._build_file_factory_options();
        // self._open_settings();

    }

    _initialize_file_chat_switches_events() { //component container left-corner
        let self = this;
        $('#chat-middle-section').css('display', 'none');

        $("#right-side-components").css('left', '250px');

        $('.file-switch, #sidenav-button-id1').on('click', function() {
            self._file_switch_action_function(this);
        });

        $('.video-stream-switch').on('click', function() {
            self._video_switch_action_function();
        });
    }

    searchResults(self, labelMap, searchContent) {
        var searchResultTop = 10;
        var html = '';

        let def = $.Deferred();
        for (let key in labelMap) {
            if (searchContent === undefined) {
                self.update_starred_files_with_icon(key);
                continue;
            }
            /*highlighting content while searching */
            let q1 = self.label_map[key].content;
            let q2 = self.label_map[key].name;
            let firstIndex_content = q1.toLowerCase().search(searchContent.toLowerCase())

            let firstIndex_name = q2.toLowerCase().search(searchContent.toLowerCase())
            if (firstIndex_content === -1 && firstIndex_name === -1) {
                continue;
            }
            let searchedSubStr = q1.substr(firstIndex_content);
            searchedSubStr = searchedSubStr.replaceAll(searchContent,
                `<span class="individual-search-file-content-span">${searchContent}</span>`)

            self.update_starred_files_with_icon(key, searchedSubStr);
        }
        def.resolve(html);
        return def.promise();
    };

    _get_file_factory_list() {
        let file_type = 'file_factory';
        let temp_map = {};
        let self = this;
        var defObj = $.Deferred();
        self.tsp.QuickNoteFirebase.get_quick_note_list().then((res) => {
            return defObj.resolve(res);
        });
        return defObj.promise();
    }

    callSearchResults(searchContent) {
        let self = this;
        if (searchContent == "") {
            self.close_results_icon.css('visibility', 'hidden');
            self.sort_files_by_name_and_update_UI();
            return;
        }

        self.close_results_icon.css('visibility', 'visible');
        // self.search_.css('visibility', 'visible');
        $('#file-middle-section').empty();
        var defSecond = $.Deferred();
        $.Deferred().resolve().then(function() {
            self.searchResults(self, self.label_map, searchContent).then(function(backHtml) {
                //                $('#file-middle-section').append(backHtml);
                self.events_map['individual-search']();
                defSecond.resolve();
            });
            return defSecond.promise();
        });
    }

    events() {
        let self = this;
        self.events_map = {
            "video-link-copy-button": () => {
                $(".video-link-copy-button").on('click', function() {
                    $('#youtube-video-link').select()
                    document.execCommand('copy')
                });
            },
            "search-box": function() {
                $('#search-box').off('keyup');
                $('#search-box').on('keyup', function() {
                    self.callSearchResults($(this).val());
                });

            },
            "individual-search": () => {
                /*after buliding the search results in middle section
                 * create event listeners for search results*/
                $('.individual-search').off('click');
                $('.individual-search').on('click', function() {
                    self.click_side_nav_button();
                    $('#quick-notes-in-file-factory').show();
                    $('.individual-search').removeClass('individual-search-background');
                    $(this).addClass('individual-search-background');
                    $('#right-side-components').css('display', 'block');
                    $('#right-side-components-container').css('display', 'block');

                    let file_key = $(this).attr('id');
                    self.curr_file_uuid = file_key;


                    let component_factory_icon = $('.active').prop('id');
                    if (self.active_switch == "video-stream-switch") {
                        $('#middle-section').hide();
                        $('#quick-notes-in-file-factory').show();

                        let file_editor = $('#quick-notes-in-file-factory').clone();
                        $('#quick-notes-in-file-factory').remove();

                        let file_editor_obj = $(file_editor).removeClass('text-editor-in-right-side-components').addClass('text-editor-in-middle-section');
                        $('#left-and-middle-section').append(file_editor_obj);


                        let screenWidth = screen.width;
                        let pane_width = parseInt($('#pane').css('width'));
                        let pane_left = parseInt($('#pane').css('left'));
                        let pane_right = parseInt($('#pane').css('right'));
                        $('#right-side-components').removeClass('right-side-components-split-screen');
                        $('#left-and-middle-section').css('width', pane_width / 2);
                        $('.file-factory-split-bar').css('left', (pane_width / 2));
                        $('#right-side-components').css('left', (pane_width / 2));
                        $('#right-side-components').css('width', (pane_width / 2) + 45);


                        $('.video-stream-back-to-file-list').on('click', function() {
                            self.tsp.GlobalConstants.previous_window = 2;
                            self.tsp.GlobalConstants.current_window = 3;
                            self._video_switch_action_function();
                        });
                        // self.initialize_summernote_for_quick_note();
                    } else if (self.active_switch == "file-switch") {
                        $('#video-stream-in-file-factory').hide();
                        $('#quick-notes-in-file-factory').show();
                        $('#middle-section').show();
                    }

                    self.events_map['save_file_if_blured']();
                    self.fillRightSideComponents(file_key);
                });
            },
            "save_file_if_blured": () => {
                $('#quick-file-editor').off();
                $('#quick-file-editor').on('keyup', function(e) {
                    self.action_function_map['save_file_if_changed']();
                    self.update_file_content_while_typing(self.curr_file_uuid, e.target.value);
                });
            },
            "back_drop_hide_on_click": () => {
                $('#quick-notes-backdrop').click(function() {
                    $(this).hide();
                });
            },
            "clear_youtube_text": () => {
                self.close_youtube_text.click(function() {
                    self.youtube_txt_box.val("");
                    $(this).hide();
                });
            },
            'on_type_display_youtube_clear': () => {
                self.youtube_txt_box.on('paste, keyup', (e) => {
                    self.close_youtube_text.show();
                    if (e.keyCode == 27) {
                        self.youtube_txt_box.val("").focus();
                        self.close_youtube_text.hide();
                    } else if (e.currentTarget.value === "") {
                        self.close_youtube_text.hide();
                    } else {
                        self.close_youtube_text.show();
                    }
                });
            },
            'on_type_in_input': () => {
                // q1 = $('#search-box').parent()

                // $(q1).children().find('.icon.close')
                $('input').on('paste, keyup', (e) => {
                    let input_ele = $(e.currentTarget);
                    let close_icon_ele = $(input_ele.parent().children().find('.icon.close'));
                    close_icon_ele.show();
                    if (e.keyCode == 27) {
                        input_ele.val("").focus();
                        close_icon_ele.hide();
                    } else if (input_ele.val() === "" || input_ele.val() === undefined) {
                        close_icon_ele.hide();
                    } else {
                        close_icon_ele.show();
                    }
                });
            },
            "search_box_clear": () => {
                $('.quick-note-search-clear').click(function() {
                    $('#search-box').val('').focus();
                    self.tsp.loadComponentsContainer.callSearchResults("");
                });
            }, 
            "tags_select": () => {
                    let local_self = this;
                   $('.filter-search-icon').on('click', (ele)=>{
                        let m1 = {};
                        let label_map = local_self.label_map;
                        let sorted_tags_names = []
                
                        for(var file_metadata_map in label_map){
                            sorted_tags_names.push(label_map[file_metadata_map].name.toLocaleLowerCase())
                        }

                        sorted_tags_names.sort()

                        setTimeout( function(){
                            $('.filter-search-icon').contextmenu();
                        }, 50);

                        sorted_tags_names.map((name) => {
                            let tag_name = name.split(' ')[0];
                            m1[tag_name] = {
                                name: tag_name
                            };
                        });
                       
                        $.contextMenu('create', {
                            selector: '.filter-search-icon',
                            className: 'tag-names-drop-down',
                            callback: function(key, options) {

                                self.search_box.val(key);
                                self.callSearchResults(key.toLocaleLowerCase());                                
                                
                            },
                            items: m1
                        });
                   }); 
                }
        }

        /* initializing eventlistners by calling above event_map in a loop*/
        for (let key in self.events_map) {
            self.events_map[key]();
        }
    };

    fillRightSideComponents(file_key) {
        let self = this;
        if (file_key === undefined || file_key === '')
            return;
        $('#file-name').text(self.label_map[file_key].name);
        $('#file-name').attr('file-key', file_key)
            // self.set_text_editor_content('');
        var html = '';
        var componentClassName = '';
        $.Deferred().resolve().then(function() {
            self._appendHtmlAndEventListner(file_key, self.label_map[file_key].content);
        });
        self.tsp.DetailsPanel.launch_quick_file_details_data(file_key);
    }

    _appendHtmlAndEventListner(mainClass, general_text_data) {
        let self = this;
        // document.getElementById('quick-file-editor').contentWindow.document.designMode = "On";
        // document.getElementById('quick-file-editor').contentWindow.document.body.innerHTML = general_text_data;
        self.set_text_editor_content(general_text_data);
        // $('#quick-file-editor').val(general_text_data);
        //        function transform(option, argument) {
        //          editor.document.execCommand(option, false, argument);
        //        }

    };

    get_file_from_server(file_key) {

        return this.label_map[file_key].content;
    }

    action_functions() {
        let self = this;
        this.action_function_map = {
            create_new_file: function() {
                $('#create-file-text-box').val("");
                self.tsp.Dialog.launch_dialog('create-new-quick-file-form', "New Note")
                $('#create-file-text-box').focus();
            },
            create_new_file_submit_btn: function() {
                let file_name = $('#create-file-text-box').val().trim();
                for (let item in self.label_map) {
                    if (self.label_map[item].name == file_name) {
                        alert(self.tsp.GlobalConstants.duplicate_quick_file);
                        return;
                    }
                }
                if (file_name == '') {
                    alert('No name entered');
                    return;
                }
                let temp_map = {
                    'folder_id': '',
                    'folder_path': '../frontend_files/web-app/all_general_files/file_factory',
                    'file_name': file_name,
                    'file_type': 'file_factory',
                    'create_type': 'File'
                }
                self.tsp.QuickNoteFirebase._create_file_in_backend_duplicate(temp_map).then(function(ret_json) {
                    self.curr_file_uuid = ret_json.file_key;
                    self.label_map[ret_json.file_key] = {
                        'name': ret_json.name,
                        'content': ret_json.content,
                        'date_created': ret_json.date_created,
                        'last_updated': ret_json.last_updated,
                        'starred': ret_json.starred
                    };
                    // let html = ` < div class = 'individual-search' id = "${ret_json.file_key}" >
                    // <span class='search-result-item' >${ret_json.name}</span></div>`;
                    let html = self.build_individual_searchresult(ret_json.file_key);
                    $('#file-middle-section').prepend($(html));
                    $('#file-name').text(ret_json.name);
                    $('#file-name').attr('file-key', ret_json.file_key);

                    self.curr_file_uuid = ret_json.file_key;
                    self.set_text_editor_content('');
                    self.tsp.NotificationBar.launch_notification(self.tsp.GlobalConstants.new_quick_file);
                    $('#modal-id').hide();
                    self.sort_files_by_name_and_update_UI();
                    $('.note-editable ').focus();
                });
            },
            save_file_if_changed: function() {
                let defObj = $.Deferred();
                var file_key = self.curr_file_uuid;
                let editor_content = self.get_text_editor_content();
                if (self.label_map[file_key].content === editor_content)
                    return;
                let file_data = editor_content;
                var savable_data = {
                    'file_key': file_key,
                    'name': self.label_map[file_key].name,
                    'content': file_data,
                    'date_created': self.label_map[file_key].date_created,
                    'starred': self.label_map[file_key].starred,
                }
                self.tsp.QuickNoteFirebase.save_quick_note(savable_data, 'content').then((res) => {
                    self.label_map[file_key] = res;
                    self.tsp.DetailsPanel.launch_quick_file_details_data(file_key);
                    return defObj.resolve(res);
                });
                return defObj.promise();

            },
            switch_class_for_video_notes_filename: ()=>{
                $('#file-name').addClass('file-name-for-video-notes');
            },
            switch_class_for_quick_notes_filename: ()=>{
                $('#file-name').removeClass('file-name-for-video-notes');
            }
        }
    }

    _create_new_file_factory_form() {
        /*create new file */
        let self = this;
        $('#create-new-file').on('click', function() {
            //                $('#create-new-file-form').css('display','block');
            self.action_function_map.create_new_file();
        });

    }

    _create_event_listeners_for_file_factory_dragbar() {
        const bar = $('.file-factory-split-bar');
        const left_part = $('#left-and-middle-section');
        const right_part = $('#right-side-components');
        let self = this;
        self.file_factory_mouse_is_down = false;

        bar.on('mousedown', function(e) {
            if (parseInt($(this).css('left')) == 20)
                return;
            self.file_factory_mouse_is_down = true;
            $('#quick-notes-backdrop').show();
        });

        bar.on('mouseup', function(e) {
            $('#quick-notes-backdrop').hide();
        });
        $(document).on('mousemove', (e) => {
            if (!self.file_factory_mouse_is_down) return;
            let screenWidth = screen.width;
            $('#right-side-components').removeClass('right-side-components-split-screen'); //.css({'left':'250px', 'width':'1090px'});
            let pane_width = parseInt($('#pane').css('width'));
            let screenLeft = parseInt($('#pane').css('left'));
            let screenRight = parseInt($('#pane').css('right'));
            let q1 = pane_width - parseInt(`${e.clientX}px`) + screenLeft; //130 is the
            let q2 = parseInt(`${e.clientX}px`);
            if (!self.file_factory_mouse_is_down || q2 >= (screenWidth / 2)) return;
            if (q2 < screenLeft || q2 > screenLeft + pane_width)
                return;
            left_part.css('width', q2 - screenLeft);
            console.log("left part width : ",  q2 - screenLeft);
            right_part.css('width', q1 + 40);
            right_part.css('left', q2 - screenLeft + 3);
            bar.css('left', q2 - screenLeft - 8);
            console.log("bar left : ", q2 - screenLeft - 8);
        });

        document.addEventListener('mouseup', () => {
            self.file_factory_mouse_is_down = false;

        });
    }

    __display_youtube_streaming_dialog() {
        //        $(this.dialog_component).css('display', 'block');
        //        $(this.dialog_component).css({'width': '40%','height': '55%','top':'32%','left':'40%'});
        $('#pane').show();
    }

    _initialize_youtube_stream() {
        let self = this;
        function check_if_the_url_is_a_pdf(url){
            let PDF = ".pdf"
            let index_of_pdf_str = url.lastIndexOf(PDF)
            
            if ( (url.length - index_of_pdf_str) == PDF.length)
                return true;
            
            return false;
        }
        $('#youtube-video-link').on('keydown', function(event){
            if(event.which !== 13 && event.which !==1 && event.which !==undefined)
                return;
            let youtube_link = $('#youtube-video-link').val();
            self.__display_youtube_streaming_dialog();
            if(check_if_the_url_is_a_pdf(youtube_link)){
                self.tsp.DomActions._create_component_open_close('pdf', youtube_link);
            }
            else{
                self.tsp.DomActions._create_component_open_close('youtube', youtube_link);
            }
        });
        $('#stream-youtube-video').on('click', function() {
           
            let youtube_link = $('#youtube-video-link').val();
            self.__display_youtube_streaming_dialog();
            if(check_if_the_url_is_a_pdf(youtube_link)){
                self.tsp.DomActions._create_component_open_close('pdf', youtube_link);
            }
            else{
                self.tsp.DomActions._create_component_open_close('youtube', youtube_link);
            }
        });

        $('#open-youtube-frame').on('click', function() {
            self.__display_youtube_streaming_dialog();
        });
    }

    __internal_rename(self, rename_field, file_key) {
        let new_file_name = $(rename_field).val();
        self.label_map[file_key].name = new_file_name;
        let send_data = {
            'file_key': file_key,
            'name': new_file_name,
            'content': self.label_map[file_key].content,
            'date_created': self.label_map[file_key].date_created,
            'starred': self.label_map[file_key].starred,
        }
        self.tsp.QuickNoteFirebase.save_quick_note(send_data, 'name').then(function(res) {
            self.label_map[file_key] = res;
            let html = self.build_individual_searchresult(file_key, res.content);

            //let new_span = `<span class="search-result-item">${new_file_name}</span>`
            let parent_ele = $(rename_field).parent();
            parent_ele.attr('id', file_key).empty();
            // if (self.label_map[file_key].starred.toString().toLowerCase() == "true")
            //     new_span = new_span + `<span><i class='icon star' ></i></span>`;

            $(parent_ele).append($(html).children().get(0));
            $(parent_ele).append($(html).children().get(1));

            // $(parent_ele).remove();
            $('#file-name').text(new_file_name);
            self.tsp.NotificationBar.launch_notification('File Renamed');
        });
    }

    _onfocusout_rename_field(file_key) {
        let self = this;
        $('#quick-file-rename-field').on('blur', function() {
            self.__internal_rename(self, this, file_key);
        });
    }

    _build_rename_field_and_call_backend() {
        let self = this;
        self.click_side_nav_button();
        let file_key = $('#file-name').attr('file-key');
        let file_name = self.label_map[file_key].name;
        let input = $(`<input type='text'
                    id='quick-file-rename-field'
                    value='${file_name}' />`);
        let curr_file_ele = $('#' + file_key)
        curr_file_ele.empty();
        curr_file_ele.append(input);
        let input_text = input.val();
        input.val('');
        input.val(input_text).focus();
        $('#quick-file-rename-field').keypress(function(e) { if (e.which == 13) $(this).blur(); });

        //        input.focus();
        self._onfocusout_rename_field(file_key);
    }
    _delete_file_in_the_backend() {
        let self = this;
        let file_key = $('#file-name').attr('file-key');

        var r = confirm("Are you sure you want to delete \n " + self.label_map[file_key].name + " ? ");
        if (r == true) {
            self.tsp.QuickNoteFirebase._delete_file(file_key).then(function() {
                let curr_file_ele = $('#' + file_key);
                $(curr_file_ele).remove();
                delete self.label_map[file_key];
                let file_uuid_key = Object.keys(self.label_map)[0];
                self.curr_file_uuid = file_uuid_key;
                self.fillRightSideComponents(file_uuid_key);
                $('.individual-search').removeClass('individual-search-background');
                $(`.individual-search[id=${file_uuid_key}]`).addClass('individual-search-background');;

                self.tsp.NotificationBar.launch_notification('File Deleted');
            }).fail(function() {
                alert('cant delete the file');
            });

        }
    }
    update_file_content_while_typing(file_uuid, content) {
        $(`.individual-search[id='${file_uuid}']`).find('.individual-search-file-content').html(content);
    }

    update_starred_files_with_icon(file_uuid, file_content) {
        let self = this;
        let star_icon_html = ` < i class = 'icon star common-icon' > < /i>`;
        let cloned;
        let add_bgC = function(file_uuid, cloned_ele) {
            if (self.curr_file_uuid == file_uuid)
                cloned_ele.addClass('individual-search-background');
            else
                cloned_ele.removeClass('individual-search-background');
        }
        let ele = $(`.individual-search[id='${file_uuid}']`);
        if (ele.length === 0) {
            let html = self.build_individual_searchresult(file_uuid, file_content);
            if (self.label_map[file_uuid].starred == "flase") {
                $('#file-middle-section').prepend($(html));
            } else {
                $('#file-middle-section').append($(html));
            }
            add_bgC(file_uuid, $(html));
        } else {
            if (self.label_map[file_uuid].starred == "false") {
                $(ele).find('.icon.star').remove();
                cloned = $(ele).clone();
                $(ele).remove();

                $('#file-middle-section').append($(cloned));
            } else {
                let level_1 = $(ele).find('.individual-search-level-1')
                if ($(level_1).find('.star.icon').length === 0)
                    $(level_1).append($(star_icon_html));
                cloned = $(ele).clone();
                $(ele).remove();
                $('#file-middle-section').prepend($(cloned));
            }
            add_bgC(file_uuid, $(cloned));
        }
    }
    starr_in_UI(file_key) {
        let self = this;
        if (self.label_map[file_key].starred == "true") {
            self.tsp.NotificationBar.launch_notification(self.tsp.GlobalConstants.quick_file_starred);
        } else {
            self.tsp.NotificationBar.launch_notification(self.tsp.GlobalConstants.quick_file_unstarred);
        }
    }
    _mark_favourite_in_the_backend() {
        let self = this;
        let file_key = self.curr_file_uuid;
        //            let file_key = $('#file-name').attr('file-key');
        let savable_data = {
            'file_key': file_key,
            'name': self.label_map[file_key].name,
            'content': self.label_map[file_key].content,
            'date_created': self.label_map[file_key].date_created,
            'starred': self.label_map[file_key].starred,
        }
        self.tsp.QuickNoteFirebase.save_quick_note(savable_data, 'starred').then(function(res) {
            self.label_map[file_key] = res;
            self.starr_in_UI(file_key);
            self.sort_files_by_name_and_update_UI();
        });
    }
    _build_file_factory_options() {
            let self = this;
            $('.quick-file-rename').off('click');
            $('.quick-file-rename').on('click', function() {
                self._build_rename_field_and_call_backend();
            });

            self.events_map['save_file_if_blured']();

            $('#video-notes-help').off('click');
            $('#video-notes-help').on('click', function() {
                self.tsp.Dialog.launch_dialog('video-notes-help-dialog', "Shortcuts");
            });

            $('.quick-file-delete').off('click');
            $('.quick-file-delete').on('click', function() {
                self._delete_file_in_the_backend();

            });

            $('.quick-file-fav').on('click', function() {
                self._mark_favourite_in_the_backend();
            });

            $('.quick-file-detail').off('click')
            $('.quick-file-detail').on('click', function() {
                self.tsp.DetailsPanel.launch_quick_file_details_data(self.curr_file_uuid);
                self.tsp.DetailsPanel.open_details();
            })


            //        $('.individual-search').off('mouseleave');
            //        $('.individual-search').on('mouseleave', function(){
            //            let curr_this =  $(this);
            //            let file_icons = curr_this.find('.file');
            //            file_icons.remove();
            //            flag = 0;
            //        });

        }
        // _open_settings() {
        //     let self = this;
        //     $('#quick-notes-setting').off('click');
        //     $('#quick-notes-setting').on('click', function() {
        //         if (self.open_setting_flag === 0) {
        //             $('.options').css({ 'display': 'flex' });
        //             $('.file-factory-options').css('visibility', 'visible');
        //             //                $('#quick-file-editor').css('left','55px');
        //             self.open_setting_flag = 1;
        //         } else {
        //             $('.options').css({ 'display': 'none' });
        //             $('.file-factory-options').css('visibility', 'hidden');
        //             //                $('#quick-file-editor').css('left','15px');
        //             self.open_setting_flag = 0;
        //         }
        //     });

    // }
    _make_resize() {
        let self = this;
        if (self.tsp.GlobalConstants.window_width < 450) {
            $('.modal-content').css("width", "calc( 80% ) !important")

        }

    }


    open_file_list_context_menu() {

        let self = this;
        $.contextMenu({
            selector: '.individual-search',
            callback: function(key, options) {
                switch (key) {
                    case "rename":
                        {
                            self._build_rename_field_and_call_backend();
                            break;
                        }
                    case "delete":
                        {
                            self._delete_file_in_the_backend();
                            break;
                        }
                    case "star":
                        {
                            self._mark_favourite_in_the_backend();
                            break;
                        }
                    case "info":
                        {
                            self.tsp.DetailsPanel.launch_quick_file_details_data(self.curr_file_uuid);
                            self.tsp.DetailsPanel.open_details();
                            break;
                        }
                }
            },
            items: {
                "rename": {
                    name: "Rename"
                },
                "star": {
                    name: "Star"
                },
                "delete": {
                    name: "Delete"
                        // icon: function() {
                        //     return 'context-menu-icon context-menu-icon-delete';
                        // }
                },
                "info": {
                    name: "Info"
                }
            }
        });
    }
    init(tsp, unused_return_values) {
        tsp.loadComponentsContainer = this;
        this.tsp = tsp;
        let self = this;
        self.label_map = {};
        self.open_setting_flag = 0;
        this.curr_file_uuid = "";
        this.active_switch = 'video-stream-switch';
        this.action_function_map = {};
        this.events_map = {};
        this.cache_elements();
        this.action_functions();
        // this.initialize_summernote_for_quick_note();
        this.open_file_list_context_menu();
        this._create_new_file_factory_form();
        this._initialize_file_chat_switches_events();
        this._create_event_listeners_for_file_factory_dragbar();
        this._initialize_youtube_stream();
        this._make_resize();
        // this._open_settings();
        this.events();
        this._build_file_factory_options();
        var screenWidth = parseInt(screen.width);
        var screenHeight = parseInt(screen.height);

        /*first time event listener is added so flag is generated*/
        let init_deferred = $.Deferred();
        let defStart = $.Deferred();

        self._get_file_factory_list().then(function(label_map) {
            if (Object.keys(label_map).length === 0) {
                let temp_map = {
                    'folder_id': '',
                    'folder_path': '../frontend_files/web-app/all_general_files/file_factory',
                    'file_name': "Welcome File",
                    'file_type': 'file_factory',
                    'create_type': 'File'
                }
                self.tsp.QuickNoteFirebase._create_file_in_backend_duplicate(temp_map, true).then(function(ret_json) {
                    self.label_map[ret_json.file_key] = {
                        'name': ret_json.name,
                        'content': ret_json.content,
                        'date_created': ret_json.date_created,
                        'last_updated': ret_json.last_updated,
                        'starred': ret_json.starred
                    };
                    self.searchResults(self, self.label_map).then(function(backHtml) {
                        self.sort_files_by_name_and_update_UI();
                        defStart.resolve();
                        return init_deferred.resolve(tsp, self.label_map);
                    });
                });
            } else {
                self.label_map = label_map;
                self.searchResults(self, self.label_map).then(function(backHtml) {
                    self.sort_files_by_name_and_update_UI();
                    defStart.resolve();
                    return init_deferred.resolve(tsp, self.label_map);

                });
            }


            //            return defStart.promise();
        });

        return init_deferred.promise();
    };
}