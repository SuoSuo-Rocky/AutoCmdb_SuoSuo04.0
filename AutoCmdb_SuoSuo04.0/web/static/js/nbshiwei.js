(function () {

    /*
    * window.onload ：
    * 必须等 网页 中 所有的内容加载完毕之后 (图片， flash , 视频),才能执行。
    *  同一 页面 不能同时 编写多个
    *   无简化写法
    *
    * */

    /*
    *  $(document).ready(function(){....});
    *  网页中 所有的  DOM 文档结构 绘制 完毕之后 即刻 执行，可能 与  DOM 元素 关联的内容
    *           (图片， flash , 视频)， 并没有加载完
    *   同以页面 可以同时编写多个 。
    *   简化写法： $(function{ })
    * */

    var requestUrl = null;

    <!-- 发送 Ajax 请求， 初始化操作页面 -->
    function init(pager){
        $.ajax({
            url: requestUrl,
            type: 'GET',
            data: {'pager': pager},
            dataType: 'JSON',
            success:function (res) {
                initGlobal(res.global_dict);
                initHeader(res.table_config);
                initBody(res.table_config, res.data_list);
                initPager(res.pager);
            }
        })
    }

    <!-- 初始化 分页组件标签  -->
    function initPager(pager){
        $('#idPagination').html(pager);
    }

    function initHeader(table) {
        var tr = document.createElement('tr');
        $.each(table,function (k,item) {
            if(item.display){
                var th = document.createElement('th');
                th.textContent = item.title;
                $(tr).append(th);
            }
        });
        $('#table_th').empty();
        $('#table_th').append(tr);
    }

    function initBody(table,data){
        $('#table_td').empty();
        $.each(data,function (k,item) {
            var tr = document.createElement('tr');
            // {#$.each(table,function (k,charge) {#}
            // {#    if(charge.display){#}
            // {#        var td = document.createElement('td');#}
            // {#        if(charge.q){#}
            // {#            td.textContent = item[charge.q];#}
            // {#        }#}
            // {#        else{#}
            // {#            var a = document.createElement('a');#}
            // {#            a.textContent = charge.title;#}
            // {#            $(td).append(a);#}
            // {#        }#}
            // {#        $(tr).append(td);#}
            // {#    }#}
            // {#}) #}
            $.each(table,function (k,config) {
                if(config.display){
                    kwargs = {};

                    <!-- 生成 td  的文本信息所需格式化 的 字典  -->
                    $.each(config.text.kwargs,function (key,value) {
                        value = value.trim();
                        if (value.substring(0,2) == '@@'){
                            var global_name = value.substring(2,value.length);
                            <!-- 从数据库中返回的为 数字  -->
                            var currentId = item[config.q];
                            <!--  根据数字 到 全局变量中 去取对应的 值 -->
                            var t = getTextFromGlobalById(global_name,currentId);
                            kwargs[key] = t;
                        }
                        else if (value[0] == "@"){
                            kwargs[key] = item[value.substring(1,value.length).trim()]
                        }else{
                            kwargs[key] = value
                        }
                    });
                    var td = document.createElement('td');
                    <!-- 不可为 textContent ,  -->
                    td.innerHTML = config.text.content.format(kwargs);
                    <!-- 设置 td 的属性 -->
                    $.each(config.attrs,function (key,value) {
                        if (value[0] == '@'){
                            td.setAttribute(key,item[value.substring(1,value.length).trim()]);
                        }else{
                            td.setAttribute(key,value);
                        }
                    });
                    $(tr).append(td);
                }
            });
            $('#table_td').append(tr);
        })
    }

    <!-- 设置 全局变量，  -->
    function initGlobal(global_dict) {
        $.each(global_dict,function (key,value) {
            window[key] = value;
        })
    }

    <!-- 根据键 从 全局变量中去取 对应的值 -->
    function getTextFromGlobalById(globalName,currentId) {
        // 'device_type_choices
        // 'currentId'  1
        var ret = null;
        $.each(window[globalName],function (k,item) {
            if(item[0] ==  currentId){
                ret = item[1];
                return     <!-- 终止循环  -->
            }
        });
        return ret;
    }

    <!-- 分页 监听 事件 -->
    function bindChangePager() {
        $('#idPagination').on('click','a',function () {
                var num = $(this).text();
                init(num);
            })
    }

    <!-- 绑定  CheckBox 的 单击 监听事件 -->
    function bindCheckBox() {
       /* on() 方法添加的事件处理程序适用于当前及未来的元素（比如由脚本创建的新元素）。
             提示：如需移除事件处理程序，请使用 off() 方法。
             提示：如需添加只运行一次的事件然后移除，请使用 one() 方法。
        */
        $('#table_td').on('click',':checkbox',function () {
            // $(this)  =  Checkbox
            $tr = $(this).parent().parent();
            // 编辑状态
            if ($('#idEditMode').hasClass('btn-warning')){
                //  获取点击之后的 状态
                var status = $(this).prop('checked');
                if (status){
                    trIntoEditMode($tr);
                    $(this).prop('checked',true);
                }else{
                    trOutEditMode($tr);
                    $(this).prop('checked',false);
                }
            // 当前处于 非编辑状态
            }else{
            }
        })
    }

    <!-- 绑定 取消 按钮 监听事件  -->
    function bindCancel() {
        $('#idCancelAll').click(function () {
            $('#table_td').find(':checkbox').each(function () {
                //  $(this)  =  Checkbox
                $tr = $(this).parent().parent();
                var status = $(this).prop('checked');
                if($('#idEditMode').hasClass('btn-warning')){
                    if (status){
                        trOutEditMode($tr);
                        $(this).prop('checked',false);
                    }
                }else{
                    if (status){
                        $(this).prop('checked',false);
                    }
                }
            })
        })
    }

    <!-- 绑定 反选 按钮 监听事件 -->
    function bindReverse() {
        $('#idReverseAll').click(function () {
            $('#table_td').find(':checkbox').each(function () {
                // $(this) =  Checkbox
                $tr = $(this).parent().parent();
                // 处于编辑模式
                if($('#idEditMode').hasClass('btn-warning')){
                    if($(this).prop('checked')){
                        trOutEditMode($tr);
                        $(this).prop('checked',false);
                    }else{
                        trIntoEditMode($tr);
                        $(this).prop('checked',true);
                    }
                //  处于 非 编辑模式
                }else{
                    if($(this).prop('checked')){

                        $(this).prop('checked',false);
                    }else{
                        $(this).prop('checked',true);
                    }
                }
            })
        });
    }

    <!-- 绑定 全选 按钮 监听事件  -->
    function bindCheckAll() {
        $('#idCheckAll').click(function () {
            $('#table_td').find(':checkbox').each(function () {
                // $(this)  =  checkbox
                if($('#idEditMode').hasClass('btn-warning')){
                    if($(this).prop('checked')){
                        // 表示 此行 已经进入 编辑模式
                    }else{
                        $(this).prop('checked',true);
                        trIntoEditMode($(this).parent().parent());
                    }
                }else{
                    $(this).prop('checked',true);
                }
            });
        });
    }

    <!-- 绑定 编辑 按钮监听事件  -->
    function bindEditModel() {
        $('#idEditMode').click(function () {
            if ($(this).hasClass('btn-warning')){
                // 退出编辑模式
                $(this).removeClass('btn-warning');
                $(this).text('进入编辑模式');
               // {#console.log($(':checkbox').parent().parent());#} // 集合元素，
                // 当 select  框 显示时， 也处于 checked 状态
                $('#table_td').find(':checked').each(function () {
                    var $selfTr = $(this).parent().parent();
                    trOutEditMode($selfTr);
                })
            }else{
                // 进入编辑模式
                $(this).addClass('btn-warning');
                 $(this).text('退出编辑模式');
                 $('#table_td').find(':checked').each(function () {
                    var $selfTr = $(this).parent().parent();
                    trIntoEditMode($selfTr);
                })
            }
        })
    }

    <!-- tr  进入  编辑模式 -->
    function trIntoEditMode($tr){
        $tr.addClass('success');
        $tr.children().each(function () {
            // $(this) = td
            var editEnable =  $(this).attr('edit-enable');
            var editType = $(this).attr('edit-type');
            if (editEnable == 'true'){
                if (editType == "select"){
                    var global_name = $(this).attr('global_name');
                    var origin = $(this).attr('origin');
                    var ele_select = document.createElement('select');
                    $.each(window[global_name],function (key,value) {
                        var  ele_option = document.createElement('option');
                        $(ele_option).val(value[0]);  // 设置的为 option 的 value 属性值
                        $(ele_option).html(value[1]);  // 设置显示的 文本
                        $(ele_select).append(ele_option);
                    });
                    // 设置 select 框 默认显示的选项，对应 option 的 value 值
                    $(ele_select).val(origin);
                    ele_select.className = 'form-control';
                    // 设置 此 td 标签 中间显示的 文本字符串， 也可为标签。
                    $(this).html(ele_select);
                } else if(editType == 'input'){
                    // 设置或返回所选元素的文本内容, 在这里也可为 html()

                    var current = $(this).text();
                    var ele_input = document.createElement('input');
                    // 设置 或返回 表单字段的 值
                    $(ele_input).val(current);
                    ele_input.className = 'form-control';
                    $(this).html(ele_input);
                }
            }
        })
    }

    <!-- tr  退出  编辑模式 -->
    function trOutEditMode($tr){
        $tr.removeClass('success');
        console.log($tr.children().length);
        $tr.children().each(function () {
            // {#var value =  $(this).text();#}   // 为 一个后代 的 大的 字符串
            // {#var name = $(this).val();#}
            // {#var names = $(this)[0].tagName;#}
            // {#console.log('name',name,"shiwei:",names);#}
            var editEnable = $(this).attr('edit-enable');
            var editType = $(this).attr('edit-type');
            if (editEnable == 'true'){
                if (editType == 'select'){
                    // 获取正在编辑的select对象
                    var $select = $(this).children().first();
                    // 获取 select 框的 value  值 , 为数字 typeId 或 statusId
                    var newId = $select.val();
                    // 获取 选中的 option 的 文本内容
                    var newText = $select[0].selectedOptions[0].innerHTML;
                    // 设置 td 元素 的内容（包括 HTML 标记）
                    $(this).html(newText);
                    $(this).attr('new-val',newId);
                }else if (editType == 'input'){
                    // 获取表单标签的 input 框的 文本内容
                    var newText = $(this).children().first().val();
                    // 设置 td 元素 的内容（包括 HTML 标记）
                    $(this).html(newText);
                    // 保存 编辑 后的 数据，为 点击保存 提交 做准备
                    $(this).attr('new-val',newText);
                }
            }
        });
    }

    <!-- 自定制 js  字符串格式化函数-->
    String.prototype.format = function (kwargs) {
      // this = 'laying:{age}--{gender}';
      // kwargs= {'age':15,'gender': '女';
        var ret = this.replace(/\{(\w+)\}/g,function (km,m) {
            return kwargs[m];
        });
        return ret;
    };



    jQuery.extend({
        'NB': function (url) {
            requestUrl = url;
            init();
            bindEditModel();
            bindCheckAll();
            bindReverse();
            bindCancel();
            bindCheckBox();
            bindChangePager();
        },
        // 'changePager': function (num) {
        //     init(num);
        // },
    })
})();