$("#btn-quicknav").toggle(function () {
        $("#header-wrap").addClass("quicknav");
        $("#quicknav").slideDown();
    },
    function () {
        $("#header-wrap").removeClass("quicknav");
        $("#quicknav").slideUp();
    }
);
$("#search-container").mouseover(function () {
    $(this).addClass("active");
    $("#s").focus().blur(function () {
        $("#search-container").removeClass("active");
    });
});

//smart-nav
if ($("#side-nav").length > 0) {
    var side_nav_top = $("#side-nav").offset().top; // gotop button height
    $(document).scroll(function () {
        if ($(this).scrollTop() > side_nav_top) {
            $("#devdoc-nav").addClass("scroll-pane")
        } else {
            $("#devdoc-nav").removeClass("scroll-pane")
        }
    });
    $("#smart-nav").prepend($("#smart-nav-containter").text());

    $(".nav-section-header").click(function () {
        if ($(this).parent().hasClass("expanded")) {
            $(".nav-section").removeClass("expanded");
            $(".nav-section ul").slideUp();
        } else {
            $(".nav-section").removeClass("expanded");
            $(this).parent().addClass("expanded");
            $(".nav-section ul").slideUp();
            $(this).siblings("ul").stop().slideDown();
        }
    });
    if (!$(".nav-section").eq(0).find("li").size()) {
        $(".nav-section").eq(0).remove();
    }
    $(".nav-section-header").eq(0).click();
    if ($("#smart-nav-related li").size()) {
        $("#smart-nav-related").fadeIn()
    }
    $("#respond input,#respond textarea").attr("placeholder", function () {
        return $(this).siblings("label").text()
    });
}
//search
function makeAjaxSearch(result) {
    if (result.length == 0) {
        $("#search_filtered").empty().show().append('<li><a href="javascript:vold(0)"><strong>404</strong></a></li>');
    } else {
        $("#search_filtered").empty().show();
        for (var i = 0; i < result.length - 1; i++) $("#search_filtered").append('<li><a href="' + result[i][1] + '">' + result[i][0] + '</a></li>');
    }
}
var delaySearch;
function startSearch() {
    $.ajax({
        type:"GET",
        url:home_url,
        data:"s=" + $("#s").val(),
        dataType:'json',
        success:function (result) {
            makeAjaxSearch(result);
        }
    });
}
$("#s").keyup(function () {
    if ($("#s").val() != "") {
        if (delaySearch) {
            clearTimeout(delaySearch)
        }
        delaySearch = setTimeout(startSearch, 250);
    } else $("#search_filtered").fadeOut();
});


//ajax comments
$('#commentform').prepend('<div id="ajax-comment-info" ></div>');
$('#commentform').submit(function () {
    var infodiv = $('#ajax-comment-info');
    //serialize and store form data in a variable
    var formdata = $('#commentform').serialize();
    console.log(formdata);
    //Add a status message
    infodiv.html('<div class="ajax-progress">真的是AJAX提交数据中... ... 请耐心等待</div>');
    //Extract action URL from $('#commentform')
    var formurl = $('#commentform').attr('action');
    //Post Form with data
    $.ajax({
        type:'post',
        url:formurl,
        data:formdata,
        error:function (XMLHttpRequest, textStatus, errorThrown) {
            infodiv.html('<div class="ajax-error" >'+XMLHttpRequest.responseText.match(/<p>(.*?)<\/p>/g)+'</div>');
        },
        success:function (data, textStatus) {
            if (data == "success")
                infodiv.html('<div class="ajax-success" >评论成功,刷新后可见.</div>');
            else
                infodiv.html('<div class="ajax-error" >服务器脑瘫,请再试一次.</div>');
            $('#commentform').find('textarea[name=comment]').val('');
        }
    });
    return false;
});

$(".morehover").hover(function(){$(this).toggleClass("hover")});