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
    questions.forEach((question) => {
        const questionType = question.dataset.type;
        const questionTitle = question.dataset.title;
        const contentArray = question.querySelectorAll('.option_content');
        const optionArray = question.querySelectorAll('.option_response_rate');
        const dataArray = new Array();
        dataArray.push(['', questionTitle]);
        for(let i=0;i<contentArray.length;i++){
            dataArray.push([contentArray[i].innerHTML.trim(), parseFloat(optionArray[i].innerHTML.trim())]);
        }
        
        const data = google.visualization.arrayToDataTable(dataArray);
        let options;
        let chart;
        if(questionType === 'radio'){
            options = {
                title: questionTitle,
            };
            chart = new google.visualization.PieChart(document.getElementById(`piechart${idx}`));
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
            chart = new google.charts.Bar(document.getElementById(`top_x_div${idx}`));
        } else if(questionType === 'select'){
            options = {
                title: questionTitle,
                pieHole: 0.4
            };
            chart = new google.visualization.PieChart(document.getElementById(`piechart${idx}`));
        }
        chart.draw(data, options);
        idx += 1;
    });
}

google.charts.load('current', {'packages':['corechart', 'bar']});
google.charts.setOnLoadCallback(drawChart);