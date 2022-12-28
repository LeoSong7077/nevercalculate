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
        payments.push(doc);
    }

    $.ajax({
        method:'post',
        url:'/calculate',
        data:{
            payments
        }
    })
    .done(result => {
        const { success, failType, data } = result;
        if (!success && failType === 'negative') alert('잘못된 입력 값입니다.');
        // if (!success && failType === 'too_low') alert('정산하기엔 금액이 너무 적습니다ㅜㅜ');
        else if (!success && failType === 'sum_0') alert('적어도 한명은 돈을 지불했어야 정산할 수 있습니다!');
        else if (success) {
            const results = data;
            $('#resultTarget').html('');
            for (let i = 0; i < results.length; i++) {
                const resultDiv = document.createElement('div');
                resultDiv.className = 'p-2 col result';
                resultDiv.id = `result${i}`;
                document.getElementById('resultTarget').appendChild(resultDiv);

                if (results[i].length > 0) {
                    const fromDiv = document.createElement('div');
                    fromDiv.className = 'from';
                    document.querySelector(`#result${i}`).appendChild(fromDiv);

                    for (let j = 0; j < results[i].length; j++) {
                        const { name, value, index } = results[i][j];

                        const toDiv = document.createElement('div');
                        fromDiv.className = 'to';
                        document.querySelector(`#result${i}`).appendChild(toDiv);
                        const innerDiv = document.createElement('div');
                        document.querySelector(`#result${i} .to`).appendChild(innerDiv);

                        const nameSpan = document.createElement('span');
                        nameSpan.className = 'to';
                        nameSpan.innerText = name;
                        const colonSpan = document.createElement('span');
                        const valueSpan = document.createElement('span');
                        valueSpan.className = 'to';
                        valueSpan.innerText = value.toLocaleString();
                        const unitSpan = document.createElement('span');

                        document.querySelector(`#result${i} .to .inner`).appendChild(nameSpan);
                        document.querySelector(`#result${i} .to .inner`).appendChild(colonSpan);
                        document.querySelector(`#result${i} .to .inner`).appendChild(valueSpan);
                        document.querySelector(`#result${i} .to .inner`).appendChild(unitSpan);
                    }
                }
                


                // $('#resultTarget').append(`
                //     <div class="p-2 col result">
                //         <div class="from">
                //             <span class="name fw-bolder">name1</span>
                //         </div>
                //         <div class="to">
                //             <div class=inner">
                //                 <span class="name">name2</span>
                //                 <span>:</span>
                //                 <span class="value">3,000</span>
                //                 <span>원</span>
                //             </div>
                //         </div>
                //         <div class="to" style="display:flex;">
                //             <div style="margin-left:auto">
                //                 <span class="name">name3</span>
                //                 <span>:</span>
                //                 <span class="value">5,000</span>
                //                 <span>원</span>
                //             </div>
                //         </div>
                //     </div>
                // `);
            }
        }
    })
    .fail(error => {
        console.log(error);
    })

}

function minusValidation(obj) {
    obj.value = !!obj.value && Math.abs(obj.value) >= 0 ? Math.abs(obj.value) : null;
}