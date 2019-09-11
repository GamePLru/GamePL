[modal]
<div id="base-modal" class="modal fade" tabindex="-1" data-width="420">
    <form action='/users/deposit' method="POST" class="form_deposit" style="padding: 10px" id="deposit">
        <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
            <h4 class="modal-title">{lang=Пополнение счета}</h4>
        </div>
        <div class="modal-body">
            <div class="input-group" style="margin-bottom: 7px;">
                <span class="input-group-addon">{lang=Сумма}</span>
                <input type="text" class="form-control" name="data[deposit]" id="deposit_val">
            </div>
            <div class="input-group qiwi" style="margin-bottom: 7px; display: none;">
                <span class="input-group-addon">{lang=Телефон}</span>
                <input type="text" class="form-control" name="data[phone]" value="+7">
            </div>
            <div class="input-group" style="margin-bottom: 7px;">
                <span class="input-group-addon">{lang=Способ}</span>
                <select name="data[tip]" class="form-control" id="deposit_tip">
                    {payments}
                </select>
            </div>
        </div>
        <div class="modal-footer">
            <input type="submit" class="btn btn-primary" id="subbuy2" rub="{rub}" value="{lang=Перейти к оплате}">
        </div>
    </form>
</div>
[/modal]
<script type="text/javascript">
    function price2() {
        c = $('#subbuy2').attr('rub');
        p = $('#deposit_val').val();
        b = $('#deposit_tip').val();
        if(b=="11"){
            $('.qiwi').css('display','table');
        }else{
            $('.qiwi').css('display','none');
        }
        a = p/c;
        var a = parseInt(a);
        $("#subbuy2").val("{lang=Итого:} "+a+" {curs-name} {lang=Продолжить}");
        setTimeout(function() {price2()},100);
    }
    $(document).ready(function(){
        user_info['curs'] = {rub};
        setTimeout(function() {price2()},100);
    });
</script>