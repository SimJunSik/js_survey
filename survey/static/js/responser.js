/*
    답변 선택 갯수 제한을 위한 함수
*/
const check_limit = (options) => {
    const limit = options.dataset.limit;
    const checkedNum = options.querySelectorAll(`input:checked`).length;
    if(checkedNum > limit){
        return false;
    }
}

/*
    사용자가 설문 제출 호출시, 중복 응답자 체크를 위한 함수
*/
const check_submit = async (event) => {
    event.preventDefault();
    /*
        checkbox 문항들 중, 체크하지 않은 문항이 있는지 확인
        있다면 해당 DOM으로 scroll
    */
    const checkBoxWrappers = document.getElementsByClassName('checkbox-wrapper');
    for (const checkBoxWrapper of checkBoxWrappers) {
        const checkedCount = checkBoxWrapper.querySelectorAll('input:checked').length;
        if(checkedCount === 0){
            alert("체크 되지 않은 문항이 있습니다.");
            checkBoxWrapper.scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"});
            return;
        }
    }

    const { target } = event;
    const responser = document.querySelector('input[name="phone_number"]').value;
    
    const response = await fetch('/check-duplicate-responser/', {
        method: 'POST',
        body: JSON.stringify({
            'responser': responser,
        })
    })
    const data = await response.json();
    if(data.result === 'SUCCESS'){
        alert("설문에 참여해주셔서 감사합니다.");
        target.submit();
    } else {
        alert("이미 설문에 참여하셨습니다.");
    }
}

document.addEventListener("DOMContentLoaded", function(){
    /*
        question_type == checkbox 인 Question에 대해
        사용자의 선택 순서를 string 으로 저장
    */
    const checkBoxList = document.querySelectorAll('input[type=checkbox]');
    checkBoxList.forEach((checkBox) => {
        checkBox.addEventListener('change', (event) => {
            const { target } = event;
            const checkOrder = document.getElementById(`question${target.name}_order`);
            const targetOrder = target.value;
            const prevOrder = checkOrder.value;

            let currentOrder = prevOrder;
            if(target.checked){ // unchecked box 를 check 한 경우
                if(currentOrder.length === 0){
                    currentOrder = targetOrder;
                } else {
                    currentOrder = prevOrder + ', ' + targetOrder;
                }
            } else { // checked box 를 uncheck 한 경우
                if(currentOrder === targetOrder){ // EX> "SNS" 에서 'SNS' 제거
                    currentOrder = prevOrder.replace(targetOrder, '');
                } else if(currentOrder.indexOf(targetOrder) === 0){ // EX> "SNS, 홈페이지" 에서 'SNS, ' 제거
                    currentOrder = prevOrder.replace(targetOrder + ', ', '');
                } else{ // EX> "SNS, 홈페이지" 에서 ', 홈페이지' 제거
                    currentOrder = prevOrder.replace(', ' + targetOrder, '');
                }
            }
            checkOrder.setAttribute('value', currentOrder);
        })
    });

    /*
        사용자가 설문 제출 호출시, 중복 응답자 체크 함수 등록
    */
    document.getElementById('survey-form').addEventListener('submit', check_submit);

    /*
        핸드폰번호 입력시 자동으로 '-' 붙게 하는 함수 등록
    */
    document.getElementById('phone_number').addEventListener('keyup', (event) => {
        const { target, key } = event;
        if(key === 'Backspace' && (target.value.length === 3 || target.value.length === 8)){
            target.value = target.value.substring(0, target.value.length-1);
        }
        if(target.value.length === 3 || target.value.length === 8){
            target.value = target.value + '-'
        }
    })
});