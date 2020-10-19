/*
    각 Question 마다 question_type에 따라 
    google chart를 그려주는 함수
    
    - radio
        > PieChart
    - checkbox
        > BarChart
    - select
        > DonutChart
*/
const drawChart = () => {
    const questions = document.querySelectorAll('.question-wrapper');
    let idx=1;
    // 각 Question 순회
    questions.forEach((question) => {
        const questionType = question.dataset.type;
        const questionTitle = question.dataset.title;
        const answerCount = question.dataset.answerCount;
        const contentArray = question.querySelectorAll('.option_content');
        const optionArray = question.querySelectorAll('.option_response_rate');
        const dataArray = new Array();
        
        // 답변이 0개인 Question은 차트 생성 X
        if(answerCount === '0'){
            return;
        }

        // 차트에 들어갈 data array 생성
        dataArray.push(['', questionTitle]);
        for(let i=0;i<contentArray.length;i++){
            dataArray.push([contentArray[i].innerHTML.trim(), parseFloat(optionArray[i].innerHTML.trim())]);
        }
        
        const data = google.visualization.arrayToDataTable(dataArray);
        let options;
        let chart;
        // Question type 에 따라 다른 종류의 차트 생성
        if(questionType === 'radio'){
            options = {
                title: questionTitle,
            };
            const targetChart = document.getElementById(`piechart${idx}`);
            chart = new google.visualization.PieChart(targetChart);
            targetChart.style.display = 'block';
        } else if(questionType === 'checkbox'){
            options = {
                title: questionTitle,
                legend: { position: 'none' },
                chart: { title: '', },
                bars: 'horizontal',
                axes: {
                    x: {
                        0: { side: 'top', label: questionTitle}
                    }
                },
                bar: { groupWidth: "90%" }
            };
            const targetChart = document.getElementById(`top_x_div${idx}`);
            chart = new google.charts.Bar(targetChart);
            targetChart.style.display = 'block';
        } else if(questionType === 'select'){
            options = {
                title: questionTitle,
                pieHole: 0.4
            };
            const targetChart = document.getElementById(`piechart${idx}`);
            chart = new google.visualization.PieChart(targetChart);
            targetChart.style.display = 'block';
        }
        chart.draw(data, options);
        idx += 1;
    });
}

google.charts.load('current', {'packages':['corechart', 'bar']});
google.charts.setOnLoadCallback(drawChart);