//import get_editor_file from './SourceCodeSection.js'

export default class DomActions {


    maximize_icon_click_action(self) {
        /* maximize-icon in drag and drop container action*/

        let curr_container_width = parseInt($('.resizable').css('width'));
        let curr_container_height = parseInt($('.resizable').css('height'));
        let screenWidth = parseInt(window.innerWidth) + 1;
        let screenHeight = parseInt(window.innerHeight) + 1;

        //    			if(curr_container_width === screenWidth && curr_container_height === screenHeight){
        if ($('#pane').hasClass('pane-full-screen')) {

            //    		        $('#pane').css({'width':'50%','height':'50%','top':'10px','left':'0px'});
            $('#pane').addClass('pane-centered');
            $('#pane').removeClass('pane-full-screen');

        } else {
            //    			    $('#pane').css({'width':screenWidth,'height':screenHeight});
            $('#pane').removeClass('pane-centered');
            $('#pane').addClass('pane-full-screen');
        }
        $('#right-side-components').addClass('right-side-components-full-screen');
        //                $('.file-factory-split-bar').css('left','-3px');
        //                $('#left-and-middle-section').css('width','0px');

    }
    _get_all_videos() {
        var defObj = $.Deferred();
        var promise =
            $.ajax({
                url: self.tsp.PrimenotesCache.data.url_prefix + "/api/individual-component-fetch/get-all-videos",
                type: "GET",
                contentType: 'application/x-www-form-urlencoded',
                success: function(response) {
                    let files = {};
                    files = response;
                    $('#video-section').empty();
                    for (let i in files) {
                        let file = files[i];
                        let video_div_html = "<div class='single-video-section'> <div class='video-content'><video width='400px' controls> <source src='http://localhost:5000/static/videos/" + file + "'  type='video/mp4'></video></div>   <div class='video-name'>" + file + "</div> </div>";
                        $('#video-section').append($(video_div_html))
                    }


                    return defObj.resolve(response);
                    alert('success');
                }
            });
        return defObj.promise();
    }

    download_video_click_action() {
        let link = $('#video-link').val();
        let name = $('#video-name').val();
        let json_body = {}
        json_body = { 'link': link, 'name': name }
        self = this;
        var defObj = $.Deferred();
        var promise =
            $.ajax({
                url: "http://localhost:5000/api/individual-component-fetch/download-youtube-video",
                type: "POST",
                data: JSON.stringify(json_body),
                contentType: 'application/x-www-form-urlencoded',
                success: function(response) {
                    self._get_all_videos();
                    return defObj.resolve(response);
                },
                error: function(jqXHR, textStatus, errorThrown) { alert(JSON.stringify(json_body) + "cant be downloaded due to format issue") }
            });
        return defObj.promise();
    }

    _tabs_drop_down_click() {
        let self = this;
        $('#project-notes-opened-list').empty();
        self.tabs_dropdown_click_flag = 1;
        var tabArr = $('.file-get-section');
        let len = tabArr.length;
        for (let i = 0; i < len; i++) {
            let cloned_ele = $($(tabArr[i]).clone());
            cloned_ele.addClass('item');
            //                        var resultHtml=`<div class='item' >`;
            //                        resultHtml+= file_name;
            //                        resultHtml+= `</div>`;
            $('#project-notes-opened-list').append(cloned_ele);

        }
        self.tsp.SourceCodeSection.events();
    }
    _build_new_component(compo_name) {
        let def = $.Deferred();
        let ele = `<div id='pro1000-component-dialog' class="create-component-dialog"  style='display:none;min-width:103.5% !important;min-height: 100% !important' title="` + compo_name + `">` +
            `<div id='create-component-dialog-sub-div' style="width: 100%;height: 100%;">` +
            `</div>` +
            `</div>`;

        $('#destination-container').append($(ele));
        def.resolve();
        return def.promise();
    }

    get_quick_note_list() {
        let self = this;
        let defObj = $.Deferred();
        let temp_map = {};
        var promise =
            $.ajax({
                url: self.tsp.PrimenotesCache.data.url_prefix + "/api/individual-component-fetch/get-all-file-factory-contents",
                type: "GET",
                contentType: 'application/x-www-form-urlencoded',
                success: function(ret_json) {
                    for (let i in ret_json) {
                        temp_map[ret_json[i].uuid_file_name] = {
                            'name': ret_json[i].name,
                            'content': ret_json[i].content,
                            'date_created': ret_json[i].date_created,
                            'last_updated': ret_json[i].last_updated,
                            'starred': ret_json[i].starred
                        };
                    }
                    return defObj.resolve(temp_map);
                }
            });
        return defObj.promise();

    }
    save_quick_note(savable_data) {
        let self = this;
        var defObj = $.Deferred();
        var promise =
            $.ajax({
                url: self.tsp.PrimenotesCache.data.url_prefix + "/api/individual-component-fetch/save-file-factory",
                data: JSON.stringify(savable_data),
                type: "POST",
                contentType: 'application/json;charset=UTF-8',
                success: function(response) {
                    self.tsp.loadComponentsContainer.label_map[file_key].content = file_data;
                    self.tsp.NotificationBar.launch_notification(self.tsp.GlobalConstants.file_saved);
                    return defObj.resolve(response);
                }
            });
        return defObj.promise();
    }
    _create_file_in_backend(file_type, file_name) {
        /*this funciton can also be used from indicidualComponentJS/main.js */
        let send_file_name = '';

        function create_action(file_name) {
            var savable_data = '';
            var defObj = $.Deferred();
            var promise =
                $.ajax({
                    url: self.tsp.PrimenotesCache.data.url_prefix + "/api/individual-component-fetch/save-file/" + file_name,
                    data: JSON.stringify(savable_data),
                    type: "POST",
                    contentType: 'application/json;charset=UTF-8',
                    success: function(response) {
                        return defObj.resolve(response);
                    }
                });
            return defObj.promise();
        }
        if (file_type === 'html_components')
            send_file_name = 'html_components-' + file_name;
        else if (file_type === 'document') {
            send_file_name = 'separate_project-' + file_name;
        } else if (file_type === 'file_factory') {
            send_file_name = '../frontend_files/web-app/all_general_files/file_factory/' + file_name + '.txt';
        }
        create_action(send_file_name);
    }
    _create_file_in_backend_duplicate(data_map) {
        /*this funciton can also be used from indicidualComponentJS/main.js */
        let self = this;
        let send_file_name = '';

        function create_action(data_map) {

            var defObj = $.Deferred();
            var promise =
                $.ajax({
                    url: self.url_prefix + "/api/individual-component-fetch/create-file/",
                    data: JSON.stringify(data_map),
                    type: "POST",
                    contentType: 'application/json;charset=UTF-8',
                    success: function(response) {
                        return defObj.resolve(response);
                    }
                });
            return defObj.promise();
        }

        return create_action(data_map);
    }
    _create_file_in_backend_with_metadata(data_map) {
        /*this funciton can also be used from indicidualComponentJS/main.js */
        let self = this;
        let send_file_name = '';

        function create_action(data_map) {

            var defObj = $.Deferred();
            var promise =
                $.ajax({
                    url: self.url_prefix + "/api/tree-note/create-folder",
                    data: JSON.stringify(data_map),
                    type: "POST",
                    contentType: 'application/json;charset=UTF-8',
                    success: function(response) {
                        return defObj.resolve(response);
                    }
                });
            return defObj.promise();
        }

        return create_action(data_map);
    }
    _copy_paste_file_in_backend_with_metadata(data_map) {
        /*this funciton can also be used from indicidualComponentJS/main.js */
        let self = this;
        let send_file_name = '';

        function create_action(data_map) {

            var defObj = $.Deferred();
            var promise =
                $.ajax({
                    url: self.url_prefix + "/api/tree-note/copy-paste-file",
                    data: JSON.stringify(data_map),
                    type: "POST",
                    contentType: 'application/json;charset=UTF-8',
                    success: function(response) {
                        return defObj.resolve(response);
                    }
                });
            return defObj.promise();
        }
        return create_action(data_map);
    }
    _cut_paste_file_in_backend_with_metadata(data_map) {
        /*this funciton can also be used from indicidualComponentJS/main.js */
        let self = this;
        let send_file_name = '';

        function create_action(data_map) {

            var defObj = $.Deferred();
            var promise =
                $.ajax({
                    url: self.url_prefix + "/api/tree-note/cut-paste-file",
                    data: JSON.stringify(data_map),
                    type: "POST",
                    contentType: 'application/json;charset=UTF-8',
                    success: function(response) {
                        return defObj.resolve(response);
                    }
                });
            return defObj.promise();
        }
        return create_action(data_map);
    }

    _rename_file_factory_files(file_type, send_data) {
        let self = this;
        let send_file_name = '';

        function rename_action(file_type, send_data) {
            var savable_data = '';
            var defObj = $.Deferred();
            var promise =
                $.ajax({
                    url: self.url_prefix + "/api/individual-component-fetch/rename-file/" + file_type,
                    type: "POST",
                    data: JSON.stringify(send_data),
                    contentType: 'application/json;charset=UTF-8',
                    success: function(response) {
                        return defObj.resolve(response);
                    }
                });
            return defObj.promise();
        }
        return rename_action(file_type, send_data);
    }
    _rename_tree_note_files(send_data) {
        let self = this;
        let send_file_name = '';

        function rename_action(file_type, send_data) {
            var savable_data = '';
            var defObj = $.Deferred();
            var promise =
                $.ajax({
                    url: self.url_prefix + "/api/individual-component-fetch/rename-tree-note-file",
                    type: "POST",
                    data: JSON.stringify(send_data),
                    contentType: 'application/json;charset=UTF-8',
                    success: function(response) {
                        return defObj.resolve(response);
                    }
                });
            return defObj.promise();
        }
        return rename_action(send_data);
    }
    _rename_tree_note_files_with_metadata(send_data) {
        let send_file_name = '';

        function rename_action(send_data) {
            var savable_data = '';
            var defObj = $.Deferred();
            var promise =
                $.ajax({
                    url: self.tsp.PrimenotesCache.data.url_prefix + "/api/tree-note/rename-file",
                    type: "POST",
                    data: JSON.stringify(send_data),
                    contentType: 'application/json;charset=UTF-8',
                    success: function(response) {
                        return defObj.resolve(response);
                    }
                });
            return defObj.promise();
        }
        return rename_action(send_data);
    }
    _rename_tree_note_folder_with_metadata(send_data) {
        let send_file_name = '';

        function rename_action(send_data) {
            var savable_data = '';
            var defObj = $.Deferred();
            var promise =
                $.ajax({
                    url: self.tsp.PrimenotesCache.data.url_prefix + "/api/tree-note/rename-folder",
                    type: "POST",
                    data: JSON.stringify(send_data),
                    contentType: 'application/json;charset=UTF-8',
                    success: function(response) {
                        return defObj.resolve(response);
                    }
                });
            return defObj.promise();
        }
        return rename_action(send_data);
    }
    _delete_file(file_key) {
        function delete_action(file_key) {
            var savable_data = '';
            var defObj = $.Deferred();
            var promise =
                $.ajax({
                    url: self.tsp.PrimenotesCache.data.url_prefix + "/api/individual-component-fetch/delete-file/file-factory/" + file_key,
                    type: "DELETE",
                    contentType: 'application/json;charset=UTF-8',
                    success: function(response) {
                        return defObj.resolve(response);
                    }
                });
            return defObj.promise();
        }
        return delete_action(file_key);
    }
    _make_quick_file_favourite(file_key) {
        function fav_action(file_key) {
            var savable_data = '';
            var defObj = $.Deferred();
            var promise =
                $.ajax({
                    url: self.tsp.PrimenotesCache.data.url_prefix + "/api/individual-component-fetch/starr/file-factory/" + file_key,
                    type: "PATCH",
                    contentType: 'application/json;charset=UTF-8',
                    success: function(response) {
                        return defObj.resolve(response);
                    }
                });
            return defObj.promise();
        }
        return fav_action(file_key);
    }
    _delete_project_note_file(uuid) {
        let self = this;

        function delete_action(uuid) {
            var savable_data = '';
            var defObj = $.Deferred();
            var promise =
                $.ajax({
                    url: self.url_prefix + "/api/tree-note/move-to-trash-tree-file-or-folder/" + uuid,
                    type: "DELETE",
                    contentType: 'application/json;charset=UTF-8',
                    success: function(response) {
                        return defObj.resolve(response);
                    }
                });
            return defObj.promise();
        }
        return delete_action(uuid);
    }
    _delete_project_note_permanently(uuid) {
        let self = this;

        function delete_action(uuid) {
            var savable_data = '';
            var defObj = $.Deferred();
            var promise =
                $.ajax({
                    url: self.url_prefix + "/api/tree-note/delete-permanently/" + uuid,
                    type: "DELETE",
                    contentType: 'application/json;charset=UTF-8',
                    success: function(response) {
                        return defObj.resolve(response);
                    }
                });
            return defObj.promise();
        }
        return delete_action(uuid);
    }
    _bulk_delete_project_note_file(in_map) {
        let self = this;

        function delete_action(to_delete_uuid_list) {
            var savable_data = '';
            var defObj = $.Deferred();
            var promise =
                $.ajax({
                    url: self.url_prefix + "/api/tree-note/bulk-move-to-trash-tree-file-or-folder",
                    type: "POST",
                    data: JSON.stringify(in_map),
                    contentType: 'application/json;charset=UTF-8',
                    success: function(response) {
                        return defObj.resolve(response);
                    }
                });
            return defObj.promise();
        }
        return delete_action(in_map);
    }
    _starr_tree_note_file_or_folder(uuid) {
        let self = this;

        function starr_action(uuid) {
            var savable_data = '';
            var defObj = $.Deferred();
            var promise =
                $.ajax({
                    url: self.url_prefix + '/api/tree-note/starr-it/' + uuid,
                    type: "PUT",
                    contentType: 'application/json;charset=UTF-8',
                    success: function(response) {
                        return defObj.resolve(response);
                    }
                });
            return defObj.promise();
        }
        return starr_action(uuid);
    }
    restore_tree_file(uuid) {
        let self = this;

        function restore_action(uuid) {
            var savable_data = '';
            var defObj = $.Deferred();
            var promise =
                $.ajax({
                    url: self.url_prefix + '/api/tree-note/restore/' + uuid,
                    type: "PUT",
                    contentType: 'application/json;charset=UTF-8',
                    success: function(response) {
                        return defObj.resolve(response);
                    }
                });
            return defObj.promise();
        }
        return restore_action(uuid);
    }
    _get_components_list() {
        let compo_names = [];
        let elems = $('.create-component');
        for (let i = 0; i < elems.length; i++) {
            compo_names.push(elems[i].title.toLowerCase());
        }
        return compo_names;
    }
    _create_component_submit_execution(event_obj) {

        let new_component_name = $('#create-component-text-box').val()
        if (new_component_name == '') {
            return;
        }
        let component_list = this._get_components_list();
        if (component_list.indexOf(new_component_name.toLowerCase()) < 0) {
            this._create_file_in_backend('html_components', new_component_name);

            /*create a new component button, building the same in current DOM and also in the backend;*/

            //building the DOM Button
            let new_component_button = `<button class='create-component create-component button tab-options-button' title='` +
                new_component_name + `' class="button tab-options-button">` +
                new_component_name + `</button>`;
            $('#component-tabs').append($(new_component_button));

            //building the component in DOM

            $('.create-component').on('click', function() {
                $(event_obj.dialog_component).css('display', 'block');
                event_obj.action_obj._create_component_open_close(event_obj, this);
            });
        } else {
            alert('Component Exists with the same name : ' + new_component_name);
        }


    }
    _build_component_dialog() {
        let compo_name = 'pro1000-component-dialog';
        var height = $(window).height();
        return $('#' + compo_name).dialog({
            width: '50%',
            height: height * 0.8,
            position: { my: "left top" },
            dialogClass: 'no-close success-dialog',
            buttons: [{
                    text: "L",
                    icon: "ui-icon-minimize",
                    title: compo_name,
                    click: function(e) {
                        let dialog_ele = $(this).parent();
                        dialog_ele.css('left', '0px');
                        dialog_ele.css('height', '100%');
                        dialog_ele.css('width', '50%');
                        dialog_ele.css('top', '0px');
                    }
                },
                {
                    text: "R",
                    icon: "ui-icon-maximize",
                    class: compo_name + 'right-orientation',
                    click: function(e) {
                        let dialog_ele = $(this).parent();
                        dialog_ele.css('left', '50%');
                        dialog_ele.css('height', '100%');
                        dialog_ele.css('width', '50%');
                        dialog_ele.css('top', '0px');
                    }
                },
                {
                    text: "[]",
                    icon: "ui-icon-maximize",
                    class: compo_name + 'right-orientation',
                    click: function(e) {
                        let dialog_ele = $(this).parent();
                        let left = '0px';
                        let top = '0px';
                        let width = '100%';
                        let height = '100%';
                        let curr_wid = parseInt($(this).parent().css('width'))
                        let curr_hei = parseInt($(this).parent().css('height'));
                        let screen_width = window.innerWidth;
                        let screen_height = window.innerHeight;
                        if (curr_wid == screen_width && curr_hei == screen_height) {
                            top = '200px';
                            left = '200px';
                            width = '50%';
                            height = "70%";
                        }
                        dialog_ele.css('top', top);
                        dialog_ele.css('left', left);
                        dialog_ele.css('height', height);
                        dialog_ele.css('width', width);
                    }
                },
                {
                    text: "X",
                    icon: "ui-icon-maximize",
                    click: function(e) {
                        let dialog_ele = $(this).parent();
                        $($('#create-component-dialog-sub-div').children()[0]).attr('src', '');
                        dialog_ele.css('display', 'none');
                    }
                }

            ],
            create: function(event, ui) {
                $('.ui-dialog-buttonset').prependTo('.ui-dialog-titlebar');
            }
        });

    }
    _get_iframe_ele(link) {
        let iframe_ele = "";
        iframe_ele = `<iframe src='${link}' style='width: inherit;height: inherit;'></iframe>`;
        return $(iframe_ele).css({ 'width': '97%', 'height': '90%' });
    }



    __get_youtube_embed_iframe(link) {
        //        let link = 'https://youtu.be/fAlTcjFXlic';
        if (link.indexOf('youtu.be') > -1) {

            let q1 = link.split('youtu.be');
            let iframe_ele = document.createElement('iframe');
            iframe_ele.src = "https://www.youtube.com/embed" + q1[1];
            //            return $(iframe_ele).css({'width':'100%','height':'100%'});
            return $(iframe_ele).attr('width', '95%').attr('height', '90%').addClass('youtube-stream');

        } else if (link.indexOf('<iframe') > -1) {
            //               return $(link).css({'width':'100%','height':'100%'});
            return $(link).attr('width', '95%').attr('height', '90%').addClass('youtube-stream');

        } else if (link.indexOf('&') > -1) {
            let link_contents = link.split('&');
            let watch_splits = link_contents[0].split('watch');
            let actual_link = watch_splits[1].split('=')[1];
            let iframe_ele = document.createElement('iframe');
            iframe_ele.src = "https://www.youtube.com/embed/" + actual_link;
            return $(iframe_ele).attr('width', '95%').attr('height', '90%').addClass('youtube-stream');

        } else if (link.includes('watch')) {
            let iframe_ele = document.createElement('iframe');
            iframe_ele.src = "https://www.youtube.com/embed/" + link.split('watch')[1].split('=')[1];
            return $(iframe_ele).attr('width', '95%').attr('height', '90%').addClass('youtube-stream');
        }


    }
    _create_component_open_close(event_obj, link) {
        let self = this;

        if (event_obj == 'youtube') {
            $('#create-component-dialog-sub-div').empty();
            let iframe_ele = this.__get_youtube_embed_iframe(link);
            // $('#middle-section').show();
            // $('#quick-notes-in-file-factory').hide();
            //                  $('#right-side-components').css({'left':'35px','width':'calc(100% - 35px)','height':'100%','display':'block'})
            // $("#right-side-components").removeClass('right-side-components-full-screen');
            // $("#right-side-components").addClass('right-side-components-split-screen');
            // $('#right-side-components-container').css({ 'width': '100%', 'height': '100%', 'display': 'block' })

            // $('.file-factory-split-bar').css('left', '350px');

            // $('#video-stream-in-file-factory').css({ 'left': '0', 'width': '100%', 'height': '100%', 'display': 'block' });
            $('#video-stream-in-file-factory').empty();
            $('#video-stream-in-file-factory').append($(iframe_ele));

        } else {
            $('#create-component-dialog-sub-div').empty();
            let iframe_ele = self._get_iframe_ele(link);
            $('#video-stream-in-file-factory').empty();
            $('#video-stream-in-file-factory').append($(iframe_ele));
            
            
            // let compo_name = $(curr_ele).attr('title');
            // let self = event_obj;

            // /*checking if the current to-generate component is already present as active element*/
            // if (self.active_component_dialog_element !== compo_name) {

            //     $('#create-component-dialog-sub-div').empty();
            //     let iframe_ele = self.._get_iframe_ele(compo_name);
            //     $('#create-component-dialog-sub-div').append(iframe_ele);
            //     $('#ui-id-2').text(compo_name);
            //     self.active_component_dialog_element = compo_name;
            // }
        }
    }
    _header_orientation_actions() {

    }
    _notification_dialog(content_str) {
        let content_html = `<span><p>${content_str}</p></span>`;
        $('#notification').empty().append($(content_html).clone()).toggleClass('display-notification');
        setTimeout(function() {
            $('#notification').toggleClass('display-notification');
        }, 2500);
    }
    set_url_for_tree_note_iframe() {
        let self = this;
        let url = self.tsp.PrimenotesCache.data.url_prefix + '/api/individual-component-fetch/summer_note';
        $('#summer-note-iframe-id').attr('src', url);
    }

    init(tsp, to_return_values) {
        tsp.DomActions = this;
        this.tsp = tsp;
        //        this._get_all_videos();
        this.url_prefix = tsp.PrimenotesCache.data.url_prefix;
        this.set_url_for_tree_note_iframe();
        return $.Deferred().resolve(this.tsp, to_return_values);
    }
}