// 정산하기 - add
let count = 4;
$(document).ready(function () {
    $('button').click(add);
});

function add() {
    if (count === 10) {
        $('#addButton').removeClass('btn-primary');
        $('#addButton').addClass('btn-secondary');
        $('#addButton').attr('disabled', true);
    }

    $('#addTarget').append(`
        <div class="p-2 bg-light row">
            <input type="text" class="form-control col float-center text-center" style="width:100px" id="" aria-describedby="emailHelp" placeholder="name${count++}">
            <div class="col my-auto">
                <span>:</span>
            </div>
            <input type="number" inputmode="demical" class="form-control col float-end text-end" style="width:150px" id="" aria-describedby="emailHelp">
            <div class="col my-auto">
                <span style="margin-left:-0.5em">원</span>
            </div>
        </div>
    `);
}

function calculate() {
    const lines = $('.line').get();
    const payments = [];
    for (let i = 0; i < lines.length; i++) {
        let [ firstInput, secondInput ] = lines[i].querySelectorAll('input');
        firstInput = firstInput.value;
        secondInput = secondInput.value;
        if (!firstInput) firstInput = `name${i+1}`;
        if (!secondInput) secondInput = 0;
        const doc = {
            name : firstInput,
            value : secondInput
        }
        payments.push(doc)
    }

    $.ajax({
        method:'post',
        url:'/calculate',
        data:{
            payments
        }
    })
    .done(result => {
        const { success, data } = result;
    })
    .fail(error => {
        console.log(error);
    })

}

function minusValidation(obj) {
    obj.value = !!obj.value && Math.abs(obj.value) >= 0 ? Math.abs(obj.value) : null;
}