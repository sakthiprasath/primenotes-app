export default class GlobalConstants {
    set_constants() {
        let self = this;

        self.video_notes_help_dialog_content = `<div class="video-notes-help-dialog" style="font-size: 14px;">
   <h3 style="font-family: Lato, &quot;Helvetica Neue&quot;, Arial, Helvetica, sans-serif; margin-right: 0px; margin-bottom: 0px; margin-left: 0px; line-height: 1.4285em; color: inherit; padding: 0px; text-align: center;"><font color="#311873">File Shortcuts</font></h3><h3 style="font-family: Lato, &quot;Helvetica Neue&quot;, Arial, Helvetica, sans-serif; margin-right: 0px; margin-bottom: 0px; margin-left: 0px; line-height: 1.4285em; color: inherit; padding: 0px; text-align: center;"><font color="#311873"><br></font></h3><h3 style="font-family: Lato, &quot;Helvetica Neue&quot;, Arial, Helvetica, sans-serif; margin-right: 0px; margin-bottom: 0px; margin-left: 0px; line-height: 1.4285em; color: inherit; padding: 0px; text-align: center;"><div class="video-notes-help-dialog" style="font-size: 14px;"></div><table class="table table-bordered" style="border-spacing: 0px; background-color: transparent;"><tbody><tr><td style="padding: 8px; border-color: rgb(221, 221, 221); line-height: 1.42857;"><label style="max-width: 100%; font-weight: 700; font-size: 14px; width: 180px; margin-right: 10px;"><kbd style="font-size: 14px; box-shadow: rgba(0, 0, 0, 0.25) 0px -1px 0px inset;">CTRL + SHIFT + H</kbd></label></td><td style="padding: 8px; border-color: rgb(221, 221, 221); line-height: 1.42857;"><span style="font-size: 14px;">Help</span><br></td></tr><tr><td style="padding: 8px; border-color: rgb(221, 221, 221); line-height: 1.42857;"><label style="max-width: 100%; font-weight: 700; font-size: 14px; width: 180px; margin-right: 10px;"><kbd style="font-size: 14px; box-shadow: rgba(0, 0, 0, 0.25) 0px -1px 0px inset;">CTRL + SHIFT + [+]</kbd></label></td><td style="padding: 8px; border-color: rgb(221, 221, 221); line-height: 1.42857;"><span style="font-size: 14px;">Create File</span><br></td></tr><tr><td style="padding: 8px; border-color: rgb(221, 221, 221); line-height: 1.42857;"><label style="max-width: 100%; font-weight: 700; font-size: 14px; width: 180px; margin-right: 10px;"><kbd style="font-size: 14px; box-shadow: rgba(0, 0, 0, 0.25) 0px -1px 0px inset;">CTRL + SHIFT + R</kbd></label></td><td style="padding: 8px; border-color: rgb(221, 221, 221); line-height: 1.42857;"><span style="font-size: 14px;">Rename File</span><br></td></tr><tr><td style="padding: 8px; border-color: rgb(221, 221, 221); line-height: 1.42857;"><label style="max-width: 100%; font-weight: 700; font-size: 14px; width: 180px; margin-right: 10px;"><kbd style="font-size: 14px; box-shadow: rgba(0, 0, 0, 0.25) 0px -1px 0px inset;">CTRL + SHIFT + DELETE</kbd></label><br></td><td style="padding: 8px; border-color: rgb(221, 221, 221); line-height: 1.42857;"><span style="font-size: 14px;">Delete File</span><br></td></tr><tr><td style="padding: 8px; border-color: rgb(221, 221, 221); line-height: 1.42857;"><label style="max-width: 100%; font-weight: 700; font-size: 14px; width: 180px; margin-right: 10px;"><kbd style="font-size: 14px; box-shadow: rgba(0, 0, 0, 0.25) 0px -1px 0px inset;">CTRL + SHIFT + F</kbd></label><br></td><td style="padding: 8px; border-color: rgb(221, 221, 221); line-height: 1.42857;"><span style="font-size: 14px;">Mark Favourite</span><br></td></tr><tr><td style="padding: 8px; border-color: rgb(221, 221, 221); line-height: 1.42857;"><label style="max-width: 100%; font-weight: 700; font-size: 14px; width: 180px; margin-right: 10px;"><kbd style="font-size: 14px; box-shadow: rgba(0, 0, 0, 0.25) 0px -1px 0px inset;">CTRL + SHIFT + I</kbd></label><br></td><td style="padding: 8px; border-color: rgb(221, 221, 221); line-height: 1.42857;"><span style="font-size: 14px;">Info&nbsp;</span></td></tr></tbody></table></h3><h3 style="font-family: Lato, &quot;Helvetica Neue&quot;, Arial, Helvetica, sans-serif; margin-right: 0px; margin-bottom: 0px; margin-left: 0px; line-height: 1.4285em; color: inherit; padding: 0px; text-align: center;"></h3><h3 style="font-family: Lato, &quot;Helvetica Neue&quot;, Arial, Helvetica, sans-serif; margin-right: 0px; margin-bottom: 0px; margin-left: 0px; line-height: 1.4285em; color: inherit; padding: 0px; text-align: center;"><font color="#311873">Editor Shortcuts</font></h3><h3 style="font-family: Lato, &quot;Helvetica Neue&quot;, Arial, Helvetica, sans-serif; margin-right: 0px; margin-bottom: 0px; margin-left: 0px; line-height: 1.4285em; color: inherit; padding: 0px; text-align: center;"><font color="#311873"><br></font></h3><h3 style="font-family: Lato, &quot;Helvetica Neue&quot;, Arial, Helvetica, sans-serif; margin-right: 0px; margin-bottom: 0px; margin-left: 0px; line-height: 1.4285em; color: inherit; padding: 0px; text-align: center;"><div class="video-notes-help-dialog" style="font-size: 14px;"><div class="video-notes-help-dialog"></div><table class="table table-bordered" style="border-spacing: 0px; background-color: transparent; width: 1108.44px; max-width: 100%;"><tbody><tr><td style="padding: 8px; border-color: rgb(221, 221, 221); line-height: 1.42857;"><label style="max-width: 100%; font-weight: 700; width: 180px; margin-right: 10px;"><kbd style="font-size: 14px; box-shadow: rgba(0, 0, 0, 0.25) 0px -1px 0px inset;">CTRL + X</kbd></label><br></td><td style="padding: 8px; border-color: rgb(221, 221, 221); line-height: 1.42857;">Cut<br></td></tr><tr><td style="padding: 8px; border-color: rgb(221, 221, 221); line-height: 1.42857;"><label style="max-width: 100%; font-weight: 700; width: 180px; margin-right: 10px;"><kbd style="font-size: 14px; box-shadow: rgba(0, 0, 0, 0.25) 0px -1px 0px inset;">CTRL + C</kbd></label><br></td><td style="padding: 8px; border-color: rgb(221, 221, 221); line-height: 1.42857;">Copy<br></td></tr><tr><td style="padding: 8px; border-color: rgb(221, 221, 221); line-height: 1.42857;"><label style="max-width: 100%; font-weight: 700; width: 180px; margin-right: 10px;"><kbd style="font-size: 14px; box-shadow: rgba(0, 0, 0, 0.25) 0px -1px 0px inset;">CTRL + V</kbd></label><br></td><td style="padding: 8px; border-color: rgb(221, 221, 221); line-height: 1.42857;">Paste<br></td></tr><tr><td style="padding: 8px; border-color: rgb(221, 221, 221); line-height: 1.42857;"><label style="max-width: 100%; font-weight: 700; width: 180px; margin-right: 10px;"><kbd style="font-size: 14px; box-shadow: rgba(0, 0, 0, 0.25) 0px -1px 0px inset;">CTRL + A</kbd></label><br></td><td style="padding: 8px; border-color: rgb(221, 221, 221); line-height: 1.42857;">Select All<br></td></tr><tr><td style="padding: 8px; border-color: rgb(221, 221, 221); line-height: 1.42857;"><label style="max-width: 100%; font-weight: 700; width: 180px; margin-right: 10px;"><kbd style="font-size: 14px; box-shadow: rgba(0, 0, 0, 0.25) 0px -1px 0px inset;">CTRL + Z</kbd></label><br></td><td style="padding: 8px; border-color: rgb(221, 221, 221); line-height: 1.42857;">Undo<br></td></tr><tr><td style="padding: 8px; border-color: rgb(221, 221, 221); line-height: 1.42857;"><label style="max-width: 100%; font-weight: 700; width: 180px; margin-right: 10px;"><kbd style="font-size: 14px; box-shadow: rgba(0, 0, 0, 0.25) 0px -1px 0px inset;">CTRL + Shift + Z</kbd></label><br></td><td style="padding: 8px; border-color: rgb(221, 221, 221); line-height: 1.42857;">Redo<br></td></tr></tbody></table></div></h3><h3 style="font-family: Lato, &quot;Helvetica Neue&quot;, Arial, Helvetica, sans-serif; margin-right: 0px; margin-bottom: 0px; margin-left: 0px; line-height: 1.4285em; color: inherit; padding: 0px; text-align: center;">
   </h3>
   <h3 style="font-family: Lato, &quot;Helvetica Neue&quot;, Arial, Helvetica, sans-serif; margin-right: 0px; margin-bottom: 0px; margin-left: 0px; line-height: 1.4285em; color: inherit; padding: 0px; text-align: center;"></h3>
</div>`;

        self.current_window = 2;
        self.previous_window = 1;
        self.top_header_highlighter = "";
        self.file_saved = "File Saved";
        self.duplicate_quick_file = 'File Eeists with the same name';
        self.new_quick_file = 'File Creation Success';
        self.quick_file_starred = 'File Starred';
        self.quick_file_unstarred = 'File UnStarred';
        self.quick_note_const = "QuickNote";
        self.window_width = window.innerWidth;
        self.window_height = window.innerHeight;

        self.offline_status = "You are currently offline";
        self.online_status = "You are back online";
        self.online_status_check_url = "https://upload.wikimedia.org/wikipedia/commons/2/28/Vijay_1996.jpg";
        self.quick_file_welcome_content = `
        File Shortcuts

        CTRL + SHIFT + H            Help
        CTRL + SHIFT + [+]          Create File
        CTRL + SHIFT + R            Rename File
        CTRL + SHIFT + DELETE       Delete File
        CTRL + SHIFT + F            Mark Favourite
        CTRL + SHIFT + I            Info

        Editor Shortcuts
        CTRL + X                    Cut 
        CTRL + C                    Copy
        CTRL + V                    Paste
        CTRL + A                    Select All
        CTRL + Z                    Undo
        CTRL + Shift + Z            Redo
            `;

        self.themes = {
            greenish: 'greenish'
        };
        self.firebase_config = self.tsp.FcBarcelona.toDecMap();
    }
    init(tsp, to_return_Values) {
        tsp.GlobalConstants = this;
        this.tsp = tsp;
        let def_obj = $.Deferred();
        this.set_constants();
        return def_obj.resolve(tsp, to_return_Values);
    }

}