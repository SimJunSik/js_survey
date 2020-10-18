const getCookie = (name) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

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
    const { target } = event;
    const responser = document.querySelector('input[name="phone_number"]').value;
    
    const csrftoken = getCookie('csrftoken');
    const response = await fetch('/survey/check-duplicate-responser/', {
        method: 'POST',
        headers: { "X-CSRFToken": csrftoken },
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
        사용자의 선택 순서 저장
    */
    const checkBoxList = document.querySelectorAll('input[type=checkbox]');
    checkBoxList.forEach((checkBox) => {
        checkBox.addEventListener('change', (event) => {
            const checkOrder = document.getElementById(`question${event.target.name}_order`);
            const targetOrder = event.target.value;
            const prevOrder = checkOrder.value;
            let currentOrder = prevOrder;
            if(event.target.checked){
                if(currentOrder.length === 0){
                    currentOrder = targetOrder;
                } else {
                    currentOrder = prevOrder + ', ' + targetOrder;
                }
            } else {
                if(currentOrder === targetOrder){
                    currentOrder = prevOrder.replace(targetOrder, '');
                } else if(currentOrder.indexOf(targetOrder) === 0){
                    currentOrder = prevOrder.replace(targetOrder + ', ', '');
                } else{
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