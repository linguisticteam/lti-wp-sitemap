(function ($) {
    'use strict';

    $(document).ready(function () {
        /**
         * Sets messages in the admin screen header
         * Triggered after updates and resets
         *
         * @param headerElem CSS class of the header element
         * @constructor
         */
        var Header = function (headerElem) {
            this.elem = $(headerElem);
            this.evalClass = function (elemClass) {
                var elem = this.elem;
                if (elem.hasClass(elemClass)) {
                    setTimeout(
                        function () {
                            elem.removeClass(elemClass);
                        }, 3000);
                    setTimeout(
                        function () {
                            $('.lti-sitemap-message').empty();
                        }, 5000);
                }
            };
        };

        var sitemap_header = $('#lti-sitemap-header');
        if (sitemap_header.length) {
            sitemap_header = new Header(sitemap_header);
            sitemap_header.evalClass('lti_update');
            sitemap_header.evalClass('lti_reset');
            sitemap_header.evalClass('lti_error');
        }

        /**
         * General > User-defined pages
         * Removes rows from the table when the red cross is clicked
         */
        $('.btn-del-row').click(function () {
            $(this).parent().parent().empty();
            console.log('click remove');
        });

        /**
         * General > User-defined pages
         * Adds row to the table when clicking on the "plus" sign
         */
        $('#btn_extra_pages_add').click(function () {
            $(this).parent().parent().before('<tr><td><input type="text" required="required" name="extra_pages_url[]" placeholder="http://www.example.com"/></td><td><input type="text" name="extra_pages_date[]" placeholder="yyyy-mm-dd"/></td><td><button type="button" class="btn-del-row dashicons dashicons-no"></button></td></tr>');
            $('.btn-del-row').click(function () {
                $(this).parent().parent().empty();
                console.log('click remove');
            });
        });

        /**
         * Allows to enable/disable groups of input fields
         * when the user activates/deactivates certain features
         *
         * Targets a div through its id and disables/enables any input, textarea or select inside it.
         */
        var input = function () {
            this.objectToLookIntoID = null;
            this.optionID = null;
        };

        input.prototype.init = function (optionID, objectToLookIntoID) {
            this.optionID = $(optionID);
            this.objectToLookIntoID = $(objectToLookIntoID);
        };

        input.prototype.disable = function () {
            this.objectToLookIntoID.find('input').attr("disabled", "disabled");
            this.objectToLookIntoID.find('textarea').attr("disabled", "disabled");
            this.objectToLookIntoID.find('select').attr("disabled", "disabled");
        };
        input.prototype.enable = function () {
            this.objectToLookIntoID.find('input').removeAttr("disabled");
            this.objectToLookIntoID.find('textarea').removeAttr("disabled");
            this.objectToLookIntoID.find('select').removeAttr("disabled");
        };

        input.prototype.toggleDisabled = function () {
            if (this.optionID.length) {
                if (typeof this.optionID.attr('checked') === "undefined") {
                    this.disable();
                }
                var option = this.optionID;
                var $this = this;
                this.optionID.click(function () {
                    if (this.checked) {
                        $this.enable();
                    } else {
                        $this.disable();
                    }
                });
            }
        };

        /**
         * When we initialize the page, we need to make sure groups of fields are disabled
         * if the parent option is not ticked
         */
        $('[data-toggle="sitemap-options"]').each(function () {
            var targetToDisable = $(this).attr('data-target');
            if (typeof targetToDisable != "undefined") {
                var element = new input();
                element.init("#" + $(this).attr('id'), targetToDisable);
                element.toggleDisabled();
            }
        });

        /**
         * Handles tabbing feature
         *
         * @type {*|HTMLElement}
         */
        var lti_sitemap_tabs = $('#lti_sitemap_tabs');
        if (lti_sitemap_tabs.length) {
            var hash = window.location.hash;
            if (hash) {
                lti_sitemap_tabs.find('a[href="' + hash + '"]').tab('show');
            } else {
                lti_sitemap_tabs.find('a[href="#tab_general"]').tab('show');
            }

            lti_sitemap_tabs.find('a').click(function (e) {
                window.location.hash = this.hash;
                e.preventDefault();
                $(this).tab('show');
            });

            //We make sure we come back to the last active tab before the page is reloaded
            $('#flsm').on('submit', function (e) {
                var hash = window.location.hash;
                if (hash) {
                    $(this).attr('action', $(this).attr('action') + hash);
                }

            });
        }

        /**
         * General > Google > "Get authentication code" button
         * Opens a google authorization window that generates an access token that we need to use the google api
         */
        $('#btn-get-google-auth').click(function (e) {
            e.preventDefault();
            var auth_url = $('#google_auth_url').val();
            if (typeof auth_url == "string" && auth_url.length > 0) {
                window.open(auth_url,
                    '',
                    'top=' + (screen.height / 2 - 580 / 2) + ',left=' + (screen.width / 2 - 640 / 2) + ',width=640,height=580,resizable=0,scrollbars=0,menubar=0,toolbar=0,status=1,location=0'
                );

            }
        });

        /**
         * General > Google > "Log in" button
         * Triggers form submission, see #flsm submit event handler
         *
         */
        $('#btn-google-log-in').click(function (e) {
            var auth_token = $('#google_auth_token');
            if (auth_token.length > 0) {
                if (auth_token.val().length == 0) {
                    e.preventDefault();
                    return false;
                }
            }
        });

        /**
         * General > Bing > send sitemap button
         * Opens a popup that sends a GET request to Bing with the sitemap url
         */
        $('#btn-bing-submit').click(function () {
            var bing_submission_script = '' + $('#bing_submission_script').val();
            window.open(bing_submission_script,
                '',
                'top=' + (screen.height / 2 - 580 / 2) + ',left=' + (screen.width / 2 - 640 / 2) + ',width=640,height=580,resizable=0,scrollbars=0,menubar=0,toolbar=0,status=1,location=0'
            );
        });

    });
})(jQuery);

/**
 * We add the little bits of Twitter Bootstrap that we need to handle tabs in our admin screen
 *
 * @link http://getbootstrap.com/javascript/#tabs
 */
if ("undefined" == typeof jQuery)throw new Error("Bootstrap's JavaScript requires jQuery");
+function (t) {
    "use strict";
    var a = t.fn.jquery.split(" ")[0].split(".");
    if (a[0] < 2 && a[1] < 9 || 1 == a[0] && 9 == a[1] && a[2] < 1)throw new Error("Bootstrap's JavaScript requires jQuery version 1.9.1 or higher")
}(jQuery), +function (t) {
    "use strict";
    function a(a) {
        return this.each(function () {
            var n = t(this), r = n.data("bs.tab");
            r || n.data("bs.tab", r = new e(this)), "string" == typeof a && r[a]()
        })
    }

    var e = function (a) {
        this.element = t(a)
    };
    e.VERSION = "3.3.2", e.TRANSITION_DURATION = 150, e.prototype.show = function () {
        var a = this.element, e = a.closest("ul:not(.dropdown-menu)"), n = a.data("target");
        if (n || (n = a.attr("href"), n = n && n.replace(/.*(?=#[^\s]*$)/, "")), !a.parent("li").hasClass("active")) {
            var r = e.find(".active:last a"), i = t.Event("hide.bs.tab", {relatedTarget: a[0]}), s = t.Event("show.bs.tab", {relatedTarget: r[0]});
            if (r.trigger(i), a.trigger(s), !s.isDefaultPrevented() && !i.isDefaultPrevented()) {
                var o = t(n);
                this.activate(a.closest("li"), e), this.activate(o, o.parent(), function () {
                    r.trigger({type: "hidden.bs.tab", relatedTarget: a[0]}), a.trigger({
                        type: "shown.bs.tab",
                        relatedTarget: r[0]
                    })
                })
            }
        }
    }, e.prototype.activate = function (a, n, r) {
        function i() {
            s.removeClass("active").find("> .dropdown-menu > .active").removeClass("active").end().find('[data-toggle="tab"]').attr("aria-expanded", !1), a.addClass("active").find('[data-toggle="tab"]').attr("aria-expanded", !0), o ? (a[0].offsetWidth, a.addClass("in")) : a.removeClass("fade"), a.parent(".dropdown-menu").length && a.closest("li.dropdown").addClass("active").end().find('[data-toggle="tab"]').attr("aria-expanded", !0), r && r()
        }

        var s = n.find("> .active"), o = r && t.support.transition && (s.length && s.hasClass("fade") || !!n.find("> .fade").length);
        s.length && o ? s.one("bsTransitionEnd", i).emulateTransitionEnd(e.TRANSITION_DURATION) : i(), s.removeClass("in")
    };
    var n = t.fn.tab;
    t.fn.tab = a, t.fn.tab.Constructor = e, t.fn.tab.noConflict = function () {
        return t.fn.tab = n, this
    };
    var r = function (e) {
        e.preventDefault(), a.call(t(this), "show")
    };
    t(document).on("click.bs.tab.data-api", '[data-toggle="tab"]', r).on("click.bs.tab.data-api", '[data-toggle="pill"]', r)
}(jQuery);