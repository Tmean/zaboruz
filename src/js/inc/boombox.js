/* eslint-disable */
import $ from 'jquery';

var Boombox = {
    init: function() {
        var self = this;

        $('[rel=boombox]').each(function(i, elem){
            $(elem).bind('click', function(e){
                e.preventDefault();
                self.setSlide(i);
            });
        });

        this.count = $('[rel=boombox]').length;

        $('body').append('<div id="boombox"></div>');

        this.boombox = $('#boombox');
        this.boombox.append('<div id="boombox__photo"></div>');
        this.boombox.append('<div id="boombox__close"></div>');
        this.boombox.append('<div id="boombox__share"></div>');
        this.boombox.append('<div id="boombox__more"></div>');
        if (this.count > 1) {
            this.boombox.append('<div id="boombox__prev"></div>');
            this.boombox.append('<div id="boombox__next"></div>');
        }

        $('#boombox__share').append("<div id='boombox__share_popup'> \
            <script src='https://yastatic.net/share2/share.js' async='async'></script> \
            <div class='ya-share2' data-services='vkontakte,facebook,odnoklassniki,gplus,twitter,' data-counter></div> \
            </div> \
        ").bind('click', function(e){
            e.preventDefault();
            $('#boombox__more').removeClass('active');
            $(this).toggleClass('active');
        });

        $('#boombox__more').append("<div id='boombox__more_popup'>\
            <a id='boombox__more_popup_origin' class='boombox__more_popup_link'>Открыть оригинал</a>\
            <a id='boombox__more_popup_download' class='boombox__more_popup_link' download>Скачать</a>\
            </div>").bind('click', function(e){
            e.preventDefault();
            $('#boombox__share').removeClass('active');
            $(this).toggleClass('active');
        });
    },

    setSlide: function(i){
        var self = this;
        var index = $('[rel=boombox]').eq(i);
        var photo = $('#boombox__photo');
        var close = $('#boombox__close');
        var more  = $('#boombox__more_popup_origin');
        var dwnl  = $('#boombox__more_popup_download');
        var prev  = $('#boombox__prev');
        var next  = $('#boombox__next');

        photo.html('');
        var promise = new Promise(function(resolve, reject) {
            var img = new Image();
            img.onload = function() {      
                var width = this.width;
                var hight = this.height;
                resolve(img)
            } 
            img.src = index.attr('href');
        }).then(function(img){
            self.resize(img.width, img.height);
            photo.html(img);
        });

        self.open();

        prev.unbind('click').bind('click', function(e){
            e.preventDefault();
            self.prev(i);
        });

        next.unbind('click').bind('click', function(e){
            e.preventDefault();
            self.next(i);
        });

        more.unbind('click').bind('click', function(e){
            e.preventDefault();
            window.open(photo.children('img').attr('src'),'_blank')
        });

        dwnl.unbind('click').bind('click', function(e){
            dwnl.attr('href', photo.children('img').attr('src'));
            e.stopPropagation();
        });

        close.bind('click', function(e){
            self.close();
        });
    },

    prev: function(i){
        if (i - 1 < 0) {
            this.setSlide(this.count - 1);
        }else{
            this.setSlide(i - 1);
        }
    },

    next: function(i){
        if (i + 1 >= this.count) {
            this.setSlide(0);
        }else{
            this.setSlide(i + 1);
        }
    },

    open: function(){
        this.boombox.fadeIn(250);
        $('body').addClass('fixed');
    },

    close: function(){
        this.boombox.fadeOut(250);
        $('body').removeClass('fixed');
    },

    resize: function(w, h){
        var maxw = window.innerWidth;
        var maxh = window.innerHeight;
        var photo = $('#boombox__photo');
        photo.css('width', maxw * 0.8);
        photo.css('height', maxh * 0.8);
    }

};

Boombox.init();

$(window).resize(Boombox.resize);
