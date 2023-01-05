// 정산하기 - add
let count = 4;
$(document).ready(function () {
    $('#addButton').click(add);
});

function add() {
    if (count === 10) {
        $('#addButton').removeClass('btn-primary');
        $('#addButton').addClass('btn-secondary');
        $('#addButton').attr('disabled', true);
    }
    // cfQxJr222 Jbedpa357
    $('#addTarget').append(`
        <div class="p-3 row line">
            <input type="text" class="form-control col float-center text-center" style="width:100px" id="" placeholder="name${count++}">
            <div class="col my-auto">
                <span>:</span>
            </div>
            <input class="form-control col float-end text-end" style="width:150px" id="" placeholder="0" data-val="0" oninput="valueInputValid(this)">
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
        if (!secondInput || isNaN(secondInput)) secondInput = 0;
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
        if (!success && failType === 'negative') return alert('잘못된 입력 값입니다.');
        if (!success && failType === 'sum_0') return alert('적어도 한명은 돈을 지불했어야 정산할 수 있습니다!');
        // if (!success && failType === 'too_low') return alert('정산하기엔 금액이 너무 적습니다!');
        if (success) {
            const results = data;
            $('#resultTarget').html('');
            let realCnt = 0;
            for (let i = 0; i < results.length; i++) {
                let [ nameInput, secondInput ] = lines[i].querySelectorAll('input');
                nameInput = nameInput.value;
                if (!nameInput) nameInput = `name${i+1}`;

                const resultDiv = document.createElement('div');
                resultDiv.className = 'p-2 col result';
                resultDiv.id = `result${i}`;
                resultDiv.style.borderBottom = '1px solid #B0B0B0';
                resultDiv.style.display = 'none';
                document.getElementById('resultTarget').appendChild(resultDiv); // 추가

                if (results[i].length > 0) {
                    $('#resultContainer').show();
                    resultDiv.style.display = 'block';

                    const fromDiv = document.createElement('div');
                    fromDiv.className = 'from';
                    document.querySelector(`#result${i}`).appendChild(fromDiv); // 추가

                    const fromNameSpan = document.createElement('span');
                    fromNameSpan.className = 'name fw-bolder';
                    fromNameSpan.innerText = nameInput;
                    document.querySelector(`#result${i} .from`).appendChild(fromNameSpan); // 추가

                    for (let j = 0; j < results[i].length; j++) {
                        const { name, value, index } = results[i][j];

                        const toDiv = document.createElement('div');
                        toDiv.className = `to${j} to`;
                        document.querySelector(`#result${i}`).appendChild(toDiv); // 추가

                        const innerDiv = document.createElement('div');
                        innerDiv.className = 'inner';
                        document.querySelector(`#result${i} .to${j}`).appendChild(innerDiv); // 추가

                        const nameSpan = document.createElement('span');
                        nameSpan.className = 'name';
                        nameSpan.innerText = `➡ ${name}`;
                        document.querySelector(`#result${i} .to${j} .inner`).appendChild(nameSpan); // 추가

                        const colonSpan = document.createElement('span');
                        colonSpan.innerText = ':';
                        document.querySelector(`#result${i} .to${j} .inner`).appendChild(colonSpan); // 추가

                        const valueSpan = document.createElement('span');
                        valueSpan.className = 'value';
                        valueSpan.innerText = value.toLocaleString();
                        document.querySelector(`#result${i} .to${j} .inner`).appendChild(valueSpan); // 추가

                        const unitSpan = document.createElement('span');
                        unitSpan.innerText = '원';
                        document.querySelector(`#result${i} .to${j} .inner`).appendChild(unitSpan); // 추가
                    }
                }
                // copy buttom

            }
            window.scrollTo(0, document.body.scrollHeight);
        }
    })
    .fail(error => {
        console.log(error);
    })

}

// function minusValidation(obj) {
//     obj.value = !!obj.value && Math.abs(obj.value) >= 0 ? Math.abs(obj.value) : null;
// }

// copy
let copyBox = document.querySelector('.copyBox');
copyBox.querySelector('button').addEventListener('click', function() {
    copyBox.classList.add('active');
    setTimeout(function() {
        copyBox.classList.remove('active');
    }, 1300);

    let copyValue = ''
    const results = document.querySelectorAll('.result');
    for (let i = 0; i < results.length; i++) {
        const from = results[i].querySelector('.from');
        if (from) {
            const from_name = from.querySelector('.name').innerText;
            copyValue += from_name;
            copyValue += '\n';
            const to_arr = results[i].querySelectorAll('.to');
            for (let j = 0; j < to_arr.length; j++) {
                const to_name = to_arr[j].querySelector('.name').innerText;
                const to_value = to_arr[j].querySelector('.value').innerText;
                copyValue += `\t\t\t${to_name} : ${to_value}원`;
                copyValue += '\n';
            }
            copyValue += '\n';
        }
    }
    // copyValue = copyValue.slice(0, -1);
    copyValue += '\t\t\tnevercalculate.com';

    window.navigator.clipboard.writeText(copyValue).then(() => {});
});

function valueInputValid(obj){
    const inputValue = obj.value;
    // var regExp = /[ \{\}\[\]\/?.,;:|\)*~`!^\-_+┼<>@\#$%&\'\"\\\(\=]/gi; 
    if(isNaN(inputValue)) { // || regExp.test(obj.value)
        obj.value = $(obj).data('val')
        alert('숫자만 입력이 가능합니다!');
        // obj.value = obj.value.substring( 0 , obj.value.length - 1 ); // 입력한 특수문자 한자리 지움
    } 
    else {
        $(obj).data('val', inputValue);
        const lineDiv = $(obj).parent('.line');
        if (!inputValue || inputValue.length < 3) lineDiv.removeClass('active');
        else {
            lineDiv.attr('data-kor', viewKorean(inputValue));
            lineDiv.addClass('active');
        } 
    } 
}

function viewKorean(num) {	
    var hanA = new Array("","일","이","삼","사","오","육","칠","팔","구","십");
    var danA = new Array("","십","백","천","","십","백","천","","십","백","천","","십","백","천");
    var result = "";
	for(i=0; i<num.length; i++) {		
		str = "";
		han = hanA[num.charAt(num.length-(i+1))];
		if(han != "")
			str += han+danA[i];
		if(i == 4) str += "만";
		if(i == 8) str += "억";
		if(i == 12) str += "조";
		result = str + result;
	}
	if(num != 0)
		result = result + "원";
    return result ;
}