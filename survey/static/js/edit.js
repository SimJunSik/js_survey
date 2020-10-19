/*
    설문 생성
*/
const create_survey = () => {
    location.href = '/survey/';
}

/*
    설문 삭제
*/
const delete_survey = (survey_id) => {
    location.href = `/survey/${survey_id}/`;
}

/*
    설문 응답 상태 toggle
*/
const toggle_survey = async (target, survey_id) => {
    const is_activated = target.dataset.isActivated;
    const confirmResult = confirm(`응답을 ${is_activated} 하시겠습니까?`);
    if(confirmResult){
        const response = await fetch(`/survey/${survey_id}/toggle/`);
        const data = await response.json();
        if(data.result === 'SUCCESS'){
            if(is_activated === '활성화'){
                target.innerHTML = '응답 활성화';
                target.setAttribute('data-is-activated', '비활성화');
            } else {
                target.innerHTML = '응답 비활성화';
                target.setAttribute('data-is-activated', '활성화');
            }
        } else {
            alert(`응답 ${is_activated} 실패`);
        }
    }
}

/*
    questionId에 해당하는 Question에
    새로운 Option 생성을 호출하는 함수
*/
const addOption = async (target) => {
    const questionId = target.dataset.questionId;
    const response = await fetch(`/question/${questionId}/option/`, {
        method: 'POST'
    });
    const data = await response.json();
    if(data.result === 'SUCCESS'){
        const questionDOM = document.getElementById(`question${questionId}`);
        const optionLength = questionDOM.getElementsByClassName("option").length;
        const optionId = data.new_option_id;

        const newOption = document.createElement("div");
        newOption.setAttribute("class", "option");
        newOption.setAttribute("id", `question${questionId}_option${optionId}`);

        const newRadio = document.createElement("input");
        const radioId = `question${questionId}_option${optionId}_radio`;
        newRadio.setAttribute("type", "radio");
        newRadio.setAttribute("id", radioId);
        newRadio.setAttribute("name", questionId);
        newRadio.setAttribute("disabled", "true");

        const newLabel = document.createElement("label");
        newLabel.setAttribute("for", radioId);

        const newRadioInput = document.createElement("input");
        newRadioInput.setAttribute("type", "text");
        newRadioInput.setAttribute("placeholder", "옵션 입력");
        newRadioInput.setAttribute("id", `question${questionId}_option${optionId}`);
        newRadioInput.setAttribute("name", `question${questionId}_option${optionId}`);

        const newDeleteButton = document.createElement("button");
        newDeleteButton.setAttribute("id", `question${questionId}_delete_button${optionId}`);
        newDeleteButton.setAttribute("class", "option-delete-button");
        newDeleteButton.setAttribute("data-question-id", questionId);
        newDeleteButton.setAttribute("data-option-id", optionId);
        newDeleteButton.innerHTML = '삭제';

        newLabel.appendChild(newRadioInput);
        newOption.appendChild(newRadio);
        newOption.appendChild(newLabel);
        newOption.appendChild(newDeleteButton);
        questionDOM.appendChild(newOption);

        const questionLimit = questionDOM.querySelector('input[type=number]');
        questionLimit.setAttribute('max', `${optionLength+1}`);
        questionLimit.setAttribute('data-limit', `${optionLength+1}`);
    } else if(data.result === 'FAIL'){
        alert("옵션 추가 실패");
    }
}

/*
    optionId 해당하는 Option 삭제를 호출하는 함수
*/
const deleteOption = async (target) => {
    const confirmResult = confirm("해당 옵션을 삭제 하시겠습니까?");
    if(confirmResult){
        const questionId = target.dataset.questionId;
        const optionId = target.dataset.optionId;
        const question = document.getElementById(`question${questionId}`);
        const optionNum = question.getElementsByClassName('option').length;
        if(optionNum == 1){
            alert("옵션은 1개 이상이어야 합니다.");
            return;
        }
    
        const response = await fetch(`/question/${questionId}/option/${optionId}/`, {
            method: 'DELETE'
        });
        const data = await response.json();
        if(data.result === 'SUCCESS'){
            const targetOption = document.getElementById(`question${questionId}_option${optionId}`);
            targetOption.remove();
        } else if(data.result === 'FAIL'){
            alert("옵션 삭제 실패");
        }
    }
}

/*
    현재 설문에 새로운 Question 생성을 호출하는 함수
*/
const addQuestion = async (survey_id) => {
    const response = await fetch('/question/', {
        method: 'POST',
        body: JSON.stringify({
            'survey_id': survey_id
        })
    })
    const data = await response.json();
    if(data.result === 'SUCCESS'){
        const questionList = document.querySelector(".question-list");
        const questionId = data.new_question_id;
        
        const newItem = document.createElement("li");
        newItem.setAttribute("class", "question-wrapper");
        newItem.setAttribute("id", `question${questionId}`);

        const newButtonWrapper = document.createElement("div");
        newButtonWrapper.setAttribute("class", "question-button-wrapper");

        const newDeleteButton = document.createElement("button");
        newDeleteButton.setAttribute("class", "question-delete-button");
        newDeleteButton.setAttribute("data-question-id", questionId);
        newDeleteButton.innerHTML = "질문 삭제";

        const newSaveButton = document.createElement("button");
        newSaveButton.setAttribute("class", "question-save-button");
        newSaveButton.setAttribute("data-question-id", questionId);
        newSaveButton.innerHTML = "저장"

        const newTitleInput = document.createElement("input");
        newTitleInput.setAttribute("class", "question_title");
        newTitleInput.setAttribute("type", "text");
        newTitleInput.setAttribute("placeholder", "질문 제목 입력");
        
        const newAddOptionButton = document.createElement("button");
        newAddOptionButton.setAttribute("class", "option-add-button");
        newAddOptionButton.setAttribute("data-question-id", questionId);
        newAddOptionButton.innerHTML = "옵션 추가";

        const newSelectType = document.createElement("select");
        newSelectType.setAttribute("name", `question${questionId}_type`);
        newSelectType.setAttribute("id", `question${questionId}_type`);
        newSelectType.setAttribute("class", "question_type");

        const newLimitInput = document.createElement("input");
        newLimitInput.setAttribute("class", "question_limit");
        newLimitInput.setAttribute("type", "number");
        newLimitInput.setAttribute("value", "1");
        newLimitInput.setAttribute("min", "1");
        newLimitInput.setAttribute("max", "1");
        newLimitInput.setAttribute("disabled", "true");

        const typeArray = ['radio','checkbox','select'];
        typeArray.forEach((type) => {
            const option = document.createElement("option");
            option.setAttribute("value", `${type}`);
            option.innerHTML = type;

            newSelectType.appendChild(option);
        });

        newButtonWrapper.appendChild(newDeleteButton);
        newButtonWrapper.appendChild(newSaveButton);
        newItem.appendChild(newButtonWrapper);
        newItem.appendChild(newTitleInput);
        newItem.appendChild(newSelectType);
        newItem.appendChild(newLimitInput);
        newItem.appendChild(newAddOptionButton);
        questionList.appendChild(newItem);
        await addOption(newAddOptionButton);
        newItem.scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"});
    } else if(data.result === 'FAIL'){
        alert("질문 생성 실패");
    }
}

const getQuestionObj = (question) => {
    const questionId = question.id.split('question')[1];
    const questionTitle = question.querySelector('.question_title').value;
    const questionType = question.querySelector('select').value;
    const questionLimit = question.querySelector('input[type=number]').value;

    const optionObjs = [];
    const options = question.querySelectorAll(".option");
    options.forEach((option) => {
        const optionId = option.id.split('option')[1];
        const optionCotent = option.querySelector('label > input').value;
        const optionObj = {
            'id': optionId,
            'content': optionCotent
        };
        optionObjs.push(optionObj);
    })

    const questionObj = {
        'id': questionId,
        'title': questionTitle,
        'question_type': questionType,
        'limit': questionLimit,
        'options': optionObjs
    }

    return questionObj;
}

const saveSurveyAll = async (surveyId) => {
    const surveyTitle = document.querySelector(".survey_title").value;
    const surveyObj = {
        'id': surveyId,
        'title': surveyTitle
    }

    const questions = document.querySelectorAll(".question-wrapper");
    const questionObjs = [];
    questions.forEach((question) => {
        const questionObj = getQuestionObj(question);
        
        questionObjs.push(questionObj);
    });

    const response = await fetch('/question/all/', {
        method: 'POST',
        body: JSON.stringify({
            'survey': surveyObj,
            'questions': questionObjs
        })
    })
    const data = await response.json();
    if(data.result === 'SUCCESS'){
        alert("저장 성공");
    } else {
        alert("저장 실패");
    }
}

/*
    questionId에 해당하는 Question 삭제를 호출하는 함수
*/
const deleteQuestion = async (target) => {
    const confirmResult = confirm("해당 질문을 삭제 하시겠습니까?");
    if(confirmResult){
        const questionId = target.dataset.questionId;
        const targetQuestion = document.getElementById(`question${questionId}`);
    
        const response = await fetch(`/question/${questionId}/`, {
            method: 'DELETE',
        })
        const data = await response.json();
        if(data.result === 'SUCCESS'){
            targetQuestion.remove();
        } else if(data.result === 'FAIL'){
            alert("질문 삭제 실패");
        }
    }
}

/*
    questionId에 해당하는 Question 업데이트를 호출하는 함수
*/
const updateQuestion = async (target) => {
    const questionId = target.dataset.questionId;
    const targetQuestion = document.getElementById(`question${questionId}`);
    const questionObj = getQuestionObj(targetQuestion);

    const response = await fetch(`/question/${questionId}/`, {
        method: 'PUT',
        body: JSON.stringify({
            'question_obj': questionObj
        })
    })
    const data = await response.json();
    if(data.result === 'SUCCESS'){
        alert("질문 업데이트 성공");
    } else if(data.result === 'FAIL'){
        alert("질문 업데이트 실패");
    }
}

/*
    question_type == checkbox 인 경우만,
    복수 선택 갯수 설정을 가능하게 하기 위한 함수
*/
const onChangeSelectType = (target) => {
    const questionId = target.id.split('_')[0];
    const question = document.getElementById(questionId);
    const questionLimit = question.querySelector('input[type=number]');

    if(target.value === 'checkbox'){
        const limit = questionLimit.dataset.limit;
        questionLimit.setAttribute('max', limit);
        questionLimit.removeAttribute('disabled');
    } else {
        questionLimit.value = '1';
        questionLimit.setAttribute('value', '1');
        questionLimit.setAttribute('max', '1');
        questionLimit.setAttribute('disabled', 'true');
    }
}

document.addEventListener("DOMContentLoaded", function(){
    /*
        각 기능 버튼에 함수 등록
    */
    document.querySelector(".question-list").addEventListener('click', async (event) => {
        const { target } = event;
        if(target && target.className === 'question-delete-button'){
            await deleteQuestion(target);
        } else if(target && target.className === 'question-save-button'){
            await updateQuestion(target);
        } else if(target && target.className === 'option-delete-button'){
            await deleteOption(target);
        } else if(target && target.className === 'option-add-button'){
            await addOption(target);
        }
    })
    
    /*
        delegation을 통해 change 리스너 등록
    */
    document.querySelector(".question-list").addEventListener('change', (event) => {
        const { target } = event;
        if(target.className === 'question_type'){
            onChangeSelectType(target);
        } else if(target.className === 'question_limit'){ // input에 값을 직접 입력했을 때 max 값을 넘지 못하게 처리
            const { value, max } = target;
            if(value > max){
                target.value = max;
            }
        }
    })
    
    /*
        설문 제목 변경 시, 헤더 타이틀 변경 함수 등록
    */
    document.querySelector(".survey_title").addEventListener('change', (event) => {
        const { target } = event;
        document.querySelector(".header").innerHTML = target.value;
    })
});