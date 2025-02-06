// ==UserScript==
// @name         Calcula horas de atribuição GPE
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  try to take over the world!
// @author       Lucas Monteiro
// @match        http://sigeduca.seduc.mt.gov.br/grh/hwmgrhpainelservidor.aspx
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gov.br
// @grant        none
// @downloadURL https://github.com/lksoumon/CalculoGPE/raw/refs/heads/main/CalculoHoras.user.js
// @updateURL https://github.com/lksoumon/CalculoGPE/raw/refs/heads/main/CalculoHoras.user.js
// ==/UserScript==

(function() {
    'use strict';

    // Cria o botão flutuante
    const floatingButton = document.createElement('button');
    floatingButton.innerHTML = 'Calcular horas';
    floatingButton.style.position = 'fixed';
    floatingButton.style.bottom = '20px';
    floatingButton.style.right = '20px';
    floatingButton.style.zIndex = '1000';
    floatingButton.style.padding = '10px';
    floatingButton.style.backgroundColor = '#007bff';
    floatingButton.style.color = 'white';
    floatingButton.style.border = 'none';
    floatingButton.style.borderRadius = '5px';
    floatingButton.style.cursor = 'pointer';

    // Cria o menu que será exibido ao clicar no botão
    const menu = document.createElement('div');
    menu.style.position = 'fixed';
    menu.style.bottom = '70px';
    menu.style.right = '20px';
    menu.style.zIndex = '1000';
    menu.style.padding = '15px';
    menu.style.backgroundColor = 'white';
    menu.style.border = '1px solid #ccc';
    menu.style.borderRadius = '5px';
    menu.style.display = 'none';

    // Adiciona o input de data
    const dateInput = document.createElement('input');
    dateInput.type = 'date';
    dateInput.style.marginBottom = '10px';
    dateInput.style.width = '100%';

    // Define a data atual no input de data
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;

    // Adiciona o botão para executar a função de data
    const executeButtonDate = document.createElement('button');
    executeButtonDate.innerHTML = 'Qtde de CH aula no dia';
    executeButtonDate.style.width = '100%';
    executeButtonDate.style.padding = '10px';
    executeButtonDate.style.backgroundColor = '#28a745';
    executeButtonDate.style.color = 'white';
    executeButtonDate.style.border = 'none';
    executeButtonDate.style.borderRadius = '5px';
    executeButtonDate.style.cursor = 'pointer';

    // Adiciona ação ao clicar no botão de execução de data
    executeButtonDate.onclick = function() {
        //alert('Função executada para a data: ' + dateInput.value);
        horasAtribuidasNoDia(dateInput.value);
        // Chame sua função com base na data selecionada
    };

    function horasAtribuidasNoDia(data){
        let output = [['vinculo','CH','codEscola','escola','processo','tipo','funcao','ini','fin']];let CHtotal = 0;
        for(var i = 1; i <= 50; i++){
            let itabela = ("0000" + i).slice(-4);

            if(document.getElementById("TABLE2_"+itabela+"0001")){
                let tabela = document.getElementById("TABLE2_"+itabela+"0001");
                let ini = document.getElementById("span_GRHATRDTAINI_"+itabela+"0001").innerText.trim();
                let fin = document.getElementById("span_GRHATRDTAFIM_"+itabela+"0001").innerText.trim();

                if(isDateInRange(ini,fin,data)){
                    //console.log(i,ini,fin,data,isDateInRange(ini,fin,data));
                    let CH = parseInt(document.getElementById("span_GRHATRTOTALCHATRIBUIDA_"+itabela+"0001").innerText.trim());
                    let codEscola = document.getElementById("span_GERLOTCOD_"+itabela+"0001").innerText.trim();
                    let escola = document.getElementById("span_GERLOTNOM_"+itabela+"0001").innerText.trim();
                    let processo = document.getElementById("span_vGRHPRCID_"+itabela+"0001").innerText.trim();
                    let funcao = document.getElementById("span_GRHFUNDSC_"+itabela+"0001").innerText.trim();
                    let vinculo = 0;
                    if(tabela.querySelectorAll('[id="span_GRHSRVVNCNUMVINC_00020001"]')[0]){
                        vinculo = tabela.querySelectorAll('[id="span_GRHSRVVNCNUMVINC_00020001"]')[0].innerText.trim();
                    }

                    let tipo = document.getElementById("span_GRHATRTPOPRCDSC_"+itabela+"0001").innerText.trim();
                    CHtotal = CHtotal + CH;
                    //console.log([vinculo,CH,codEscola,escola,processo,tipo,funcao,ini,fin]);
                    output.push([vinculo,CH,codEscola,escola,processo,tipo,funcao,ini,fin]);

                }


            }

        }
        //alert("Total de CH na data: "+CHtotal);
        arrayToHtmlTable(output,"Total de CH na data "+data+" -> "+CHtotal+" horas");
    }

    function isDateInRange(ini, fin, ver) {
    // Função para converter string no formato dd/mm/yy para objeto Date
        function parseDateShort(dateStr) {
            const [day, month, year] = dateStr.split('/').map(Number);
            // Adiciona 2000 aos anos para garantir que estão no século 21
            return new Date(year + 2000, month - 1, day);
        }

        // Função para converter string no formato dd/mm/yyyy para objeto Date
        function parseDateISO(dateStr) {
            return new Date(dateStr); // Formato ISO é diretamente suportado pelo JavaScript
        }

        // Converte as datas recebidas em objetos Date
        const startDate = parseDateShort(ini);
        const endDate = parseDateShort(fin);
        const checkDate = parseDateISO(ver);
        //console.log(startDate,endDate,checkDate);
        // Verifica se a data de verificação está entre as datas inicial e final
        return checkDate >= startDate && checkDate <= endDate;
    }
    // Adiciona uma div com dropdown de meses
    const monthDiv = document.createElement('div');
    monthDiv.style.marginTop = '15px';

    // Adiciona o input dropdown de meses
    const monthSelect = document.createElement('select');
    monthSelect.style.width = '100%';
    const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

    months.forEach((month, index) => {
        const option = document.createElement('option');
        option.value = index + 1;  // Meses de 1 a 12
        option.text = month;
        monthSelect.appendChild(option);
    });

    // Adiciona o botão para executar a função de mês
    const executeButtonMonth = document.createElement('button');
    executeButtonMonth.innerHTML = 'Calcular salário estimado no Mês';
    executeButtonMonth.style.width = '100%';
    executeButtonMonth.style.padding = '10px';
    executeButtonMonth.style.backgroundColor = '#dc3545';
    executeButtonMonth.style.color = 'white';
    executeButtonMonth.style.border = 'none';
    executeButtonMonth.style.borderRadius = '5px';
    executeButtonMonth.style.cursor = 'pointer';
    executeButtonMonth.style.marginTop = '10px';

    // Adiciona ação ao clicar no botão de execução de mês
    executeButtonMonth.onclick = function() {
        //alert('Função executada para o mês: ' + monthSelect.value);
        salarioMes(monthSelect.value);
        // Chame sua função com base no mês selecionado
    };
    function salarioMes(mes){
        let output = [['vinculo','codEscola','escola','processo','tipo','funcao','ini','fin','Dias trabalhados no mês','CH-aula','CH-atividade','R$ aula','R$ ativdidade', 'R$ total']];let CHtotal = 0;
        for(var i = 1; i <= 50; i++){
            let itabela = ("0000" + i).slice(-4);

            if(document.getElementById("TABLE2_"+itabela+"0001")){
                let tabela = document.getElementById("TABLE2_"+itabela+"0001");
                let ini = document.getElementById("span_GRHATRDTAINI_"+itabela+"0001").innerText.trim();
                let fin = document.getElementById("span_GRHATRDTAFIM_"+itabela+"0001").innerText.trim();

                if(countDaysInMonth(ini,fin,mes)>0){
                    console.log(i,ini,fin,mes,countDaysInMonth(ini,fin,mes));
                    let diasTrab = countDaysInMonth(ini,fin,mes);
                    let diasMes = getDaysInMonth(mes,2025);
                    let CH = parseInt(document.getElementById("span_GRHATRTOTALCHATRIBUIDA_"+itabela+"0001").innerText.trim());
                    let codEscola = document.getElementById("span_GERLOTCOD_"+itabela+"0001").innerText.trim();
                    let escola = document.getElementById("span_GERLOTNOM_"+itabela+"0001").innerText.trim();
                    let processo = document.getElementById("span_vGRHPRCID_"+itabela+"0001").innerText.trim();
                    let funcao = document.getElementById("span_GRHFUNDSC_"+itabela+"0001").innerText.trim();
                    let vinculo = 0;
                    if(tabela.querySelectorAll('[id="span_GRHSRVVNCNUMVINC_00020001"]')[0]){
                        vinculo = tabela.querySelectorAll('[id="span_GRHSRVVNCNUMVINC_00020001"]')[0].innerText.trim();
                    }
                    let tipo = document.getElementById("span_GRHATRTPOPRCDSC_"+itabela+"0001").innerText.trim();
                    CHtotal = CHtotal + CH;
                    let CHatividade = Math.ceil(CH/2);

                    let salario = Math.round((CH * 152.992222222222)*(diasTrab/diasMes),2);
                    //console.log([vinculo,CH,codEscola,escola,processo,tipo,funcao,ini,fin]);
                    output.push([vinculo,codEscola,escola,processo,tipo,funcao,ini,fin,diasTrab,CH,CHatividade,"R$ "+salario,"R$ "+salario/2,"R$ "+salario*1.5]);

                }


            }

        }
        //alert("Total de CH na data: "+CHtotal);
        arrayToHtmlTable(output,"Contratos do "+mes+" -> "+CHtotal+" horas");
    }

    function countDaysInMonth(ini, fin, mes) {
        // Função para converter string no formato dd/mm/yy para objeto Date
        function parseDateShort(dateStr) {
            const [day, month, year] = dateStr.split('/').map(Number);
            const fullYear = year < 100 ? year + 2000 : year; // Ajusta para o século 21
            return new Date(fullYear, month - 1, day);
        }

        // Converte as datas inicial e final
        const startDate = parseDateShort(ini);
        const endDate = parseDateShort(fin);

        // Verifica se as datas foram convertidas corretamente
        if (isNaN(startDate) || isNaN(endDate)) {
            console.error('Erro na conversão das datas:', { ini, fin });
            return 0;
        }

        // Ajusta as datas caso startDate seja maior que endDate
        if (startDate > endDate) {
            console.error('Data inicial é maior que a data final.');
            return 0;
        }

        let count = 0;
        //console.log(startDate,endDate,mes);
        // Itera de startDate até endDate
        for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
            if (date.getMonth() + 1 == mes) { // getMonth retorna 0 a 11, então somamos 1
                count++;
            }
        }

        return count;
    }

    function getDaysInMonth(month, year) {
        // Ajusta o ano para o século 21 se necessário
        const fullYear = year < 100 ? year + 2000 : year;

        // O JavaScript trata o mês de 0 (Janeiro) a 11 (Dezembro), então subtrai 1 do mês
        return new Date(fullYear, month, 0).getDate();
    }
    // Adiciona o input dropdown e o botão de mês na div
    monthDiv.appendChild(monthSelect);
    monthDiv.appendChild(executeButtonMonth);

    // Adiciona os elementos ao menu
    menu.appendChild(dateInput);
    menu.appendChild(executeButtonDate);
    menu.appendChild(monthDiv);

    // Adiciona o botão e o menu ao corpo da página
    document.body.appendChild(floatingButton);
    document.body.appendChild(menu);

    // Mostra ou oculta o menu ao clicar no botão flutuante
    floatingButton.onclick = function() {
        menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
    };







    function arrayToHtmlTable(dataArray,titulo) {
        // Abrir uma nova janela
        var novaJanela = window.open('', '_blank');

        // Criar o conteúdo HTML para a tabela
        var tabelaHTML = '<head><title>tabela gerada</title><h2>'+titulo+'</h2></head><body><table border="1"><thead><tr>';

        // Adicionar cabeçalho da tabela
        if (dataArray.length > 1) {
            dataArray[0].forEach(function (coluna) {
                tabelaHTML += '<th>' + coluna + '</th>';
            });
            tabelaHTML += '</tr></thead><tbody>';

            // Adicionar linhas da tabela
            for (var i = 1; i < dataArray.length; i++) {
                tabelaHTML += '<tr>';
                dataArray[i].forEach(function (valor) {
                    tabelaHTML += '<td>' + valor + '</td>';
                });
                tabelaHTML += '</tr>';
            }

            tabelaHTML += '</tbody></table></body>';

            // Adicionar tabela ao conteúdo da nova janela
            novaJanela.document.write(tabelaHTML);
        } else {
            // Se a array estiver vazia, exibir uma mensagem na nova janela
            novaJanela.document.write('<p>Nenhum erro encontrado pelo script!</p>');
        }
    }


})();
