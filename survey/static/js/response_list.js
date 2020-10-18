/*
    이전 응답자의 응답 결과를 보여주기 위한 함수
*/
const prev_response_index = () => {
    const index = document.getElementById("response_index_current");
    const currentIndex = parseInt(index.innerHTML);
    if(currentIndex > 1){
        index.innerHTML = currentIndex - 1;

        const responses = document.getElementsByClassName("response-wrapper");
        responses[currentIndex-1].style.display = 'none';
        responses[currentIndex-2].style.display = 'block';
    }

}

/*
    다음 응답자의 응답 결과를 보여주기 위한 함수
*/
const next_response_index = () => {
    const index = document.getElementById("response_index_current");
    const currentIndex = parseInt(index.innerHTML);
    const lastIndex = parseInt(document.getElementById("response_index_last").innerHTML);
    if(currentIndex < lastIndex){
        index.innerHTML = currentIndex + 1;

        const responses = document.getElementsByClassName("response-wrapper");
        responses[currentIndex-1].style.display = 'none';
        responses[currentIndex].style.display = 'block';
    }

}