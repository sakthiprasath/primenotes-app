

export default class NotificationBar{
    cache_elems(){
        let self = this;
        self.modal = $("#notification");
        self.close = $('.content > .close');
        self.header = $('#notification .header');
        self.meta = $('#notification .meta');
        self.description = $('#notification .description');
    }
    build_outer_part(){
        let html = `<div class="card">
                        <div class="content">
                            <i class="right floated close icon"></i>
                            <div class="header"></div>
                            <div class="meta"></div>
                            <div class="description"></div>
                        </div>
                    </div>`;
        $("#notification").html(html);
    }
    launch_notification(meta='', header='', description='', show_seconds=2500){
        let self = this;
        if(header != '')
            self.header.text(header);
        if(meta != '')
            self.meta.text(meta);

        if(description != '')
            self.description.html(description);
        $('#notification').show();

        if(show_seconds != "INFINITY"){
            setTimeout(function(){
                    $('#notification').hide();
            }, show_seconds);
        }
    }
    events(){
        let self = this;
        let event_map ={
            close_notification_dialog : function(){
                self.close.on('click', function(){
                    self.modal.hide();
                });
            }
        }
        /* initializing eventlistners by calling above event_map in a loop*/
        for (let key in event_map) {
          event_map[key]();
        }
    }
    init(tsp, to_return_Values){
        tsp.NotificationBar = this;
        this.tsp = tsp;
        this.event_map = {};
        this.build_outer_part();
        this.cache_elems();
        this.events();
        return $.Deferred().resolve(tsp, to_return_Values);
    }

}
