var parties = ['Socialdemokratiet', 'Radikale Venstre', 'Det Konservative Folkeparti', 'Nye Borgerlige', 'SF - Socialistisk Folkeparti', 'Liberal Alliance', 'Kristendemokraterne', 'Moderaterne', 'Dansk Folkeparti', 'Frie Grønne', 'Venstre, Danmarks Liberale Parti', 'Danmarksdemokraterne ‒ Inger Støjberg', 'Enhedslisten – De Rød-Grønne', 'Alternativet'];

var party_colors = {
    'Socialdemokratiet': '#a82721',
    'Radikale Venstre': '#733280',
    'Det Konservative Folkeparti': '#96b226',
    'Nye Borgerlige': '#127b7f',
    'SF - Socialistisk Folkeparti': '#e07ea8',
    'Liberal Alliance': '#3fb2be',
    'Kristendemokraterne': '#8b8474',
    'Moderaterne': '#b48cd2',
    'Dansk Folkeparti': '#eac73e',
    'Frie Grønne': '#5abe82',
    'Venstre, Danmarks Liberale Parti': '#254264',
    'Danmarksdemokraterne ‒ Inger Støjberg': '#7896d2',
    'Enhedslisten – De Rød-Grønne': '#e6801a',
    'Alternativet': '#2b8738',
    'Uden for partierne': '#000000',
};

var party_markers = {
    'Socialdemokratiet': 'A',
    'Radikale Venstre': 'B',
    'Det Konservative Folkeparti': 'C',
    'Nye Borgerlige': 'D',
    'SF - Socialistisk Folkeparti': 'F',
    'Liberal Alliance': 'I',
    'Moderaterne': 'M',
    'Dansk Folkeparti': 'O',
    'Frie Grønne': 'Q',
    'Venstre, Danmarks Liberale Parti': 'V',
    'Danmarksdemokraterne ‒ Inger Støjberg': 'Æ',
    'Enhedslisten – De Rød-Grønne': 'Ø',
    'Alternativet': 'Å',
    'Uden for partierne': 'X',
    'Kristendemokraterne': 'K',
}

// party_answers is imported from party_answers.js and is a nested dict with the following structure:
// party_answers = {
//     '1': {
//         'Socialdemokratiet': 0.552,
//...
document.addEventListener('DOMContentLoaded', function () {
    var question_table = {};
    var party_marker_elements = {};
    function createPartyAnswers(party_answers_div) {
        var question_number = party_answers_div.id.split('-')[1];
        var table_element = document.createElement('table');
        var table_body = document.createElement('tbody');

        table_element.appendChild(table_body);
        party_answers_div.appendChild(table_element);

        table_element.style.width = '100%';
        var tr = document.createElement('tr');
        tr.className = 'party-answers-row';
        table_body.appendChild(tr);
        question_table[question_number] = tr;
        party_marker_elements[question_number] = [];
        for (var i = 0; i < parties.length; i++) {
            var party = parties[i];
            var marker = document.createElement('div');
            marker.className = 'marker';
            marker.style.backgroundColor = party_colors[party];
            marker.style.color = 'white';
            marker.innerHTML = party_markers[party];
            party_marker_elements[question_number].push(marker);
        }
    }
    function updatePartyAnswers(party_answers_div) {
        var question_number = party_answers_div.id.split('-')[1];
        //Get the width of the div
        var width = party_answers_div.offsetWidth;
        //Get number of columns based on width, one party marker is 20px wide
        //Round to nearest uneven number
        var columns = Math.floor(width / 20);
        if (columns % 2 == 0) {
            columns--;
        }

        var tr = question_table[question_number];
        //Delete table rows if they exist
        while (tr.firstChild) {
            tr.removeChild(tr.firstChild);
        }
        var table = []; //2D arrawy
        for (var j = 0; j <= columns; j++) {
            table.push([]);
        }
        //Populate the table with the party markers
        for (var j = 0; j < parties.length; j++) {
            var party = parties[j];
            var party_answer = (party_answers[question_number][party] + 2) / 4;
            var column = Math.floor(party_answer * columns);
            if (column == columns) {
                column--;
            }
            table[column].push(party);
        }
        //Create the table
        //Add div with class marker for each party in column
        for (var j = 0; j < columns; j++) {
            var td = document.createElement('td');
            if (table[j].length) {
                //Add vertical line in the middle of each column
                var vertical_line = document.createElement('div');
                vertical_line.className = 'vertical-line';
                td.appendChild(vertical_line);
            }

            td.className = 'party-answers-column';
            for (var k = 0; k < table[j].length; k++) {
                var party = table[j][k];
                var marker = party_marker_elements[question_number][parties.indexOf(party)];
                td.appendChild(marker);
            }
            tr.appendChild(td);
        }
    }
    function removePartyAnswers(party_answers_div) {
        var question_number = party_answers_div.id.split('-')[1];
        var tr = question_table[question_number];
        while (tr.firstChild) {
            tr.removeChild(tr.firstChild);
        }
    }
    function addPartyAnswers() {
        var party_answers_divs = document.getElementsByClassName('party-answers');
        for (var i = 0; i < party_answers_divs.length; i++) {
            createPartyAnswers(party_answers_divs[i]);
        }
    }
    var party_answers_button = document.getElementById("show-parties");
    function updatePartyAnswersAll() {
        if (!party_answers_button.checked) {
            return;
        }
        var party_answers_divs = document.getElementsByClassName('party-answers');
        for (var i = 0; i < party_answers_divs.length; i++) {
            updatePartyAnswers(party_answers_divs[i]);
        }
    }
    function updatePartyAnswerButton() {
        if (party_answers_button.checked) {
            updatePartyAnswersAll();
            document.getElementById("party-legend").style.display = "block";
        } else {
            document.getElementById("party-legend").style.display = "none";
            var party_answers_divs = document.getElementsByClassName('party-answers');
            for (var i = 0; i < party_answers_divs.length; i++) {
                removePartyAnswers(party_answers_divs[i]);
            }
        }
    }

    addPartyAnswers();
    updatePartyAnswersAll();
    window.addEventListener('resize', updatePartyAnswersAll);
    party_answers_button.addEventListener('change', updatePartyAnswerButton);

    var question_neutral_buttons = document.getElementsByClassName('neutral-box');
    for (var i = 0; i < question_neutral_buttons.length; i++) {
        question_neutral_buttons[i].addEventListener('change', function () {
            var question_number = this.id.split('-')[1];
            var question_slider = document.getElementById('Q-' + question_number + '-s');
            if (this.checked) {
                question_slider.value = question_slider.defaultValue;
                question_slider.disabled = true;
            } else {
                question_slider.disabled = false;
            }
        });
    }

    window.addEventListener('resize', function () {
        var right = document.getElementById('right');
        var left = document.getElementById('left');
        if (window.innerHeight > window.innerWidth) {
            right.style.width = '100%';
            left.style.width = '100%';
            right.style.position = 'relative';
            //left_upper.style.height = '100%';
            //left_lower.style.position = 'relative';
        } else {
            right.style.width = '50%';
            left.style.width = '50%';
            right.style.position = 'fixed';
            //left_upper.style.height = '55vh';
            //left_lower.style.position = 'fixed';
        }
    });
});
//Using d3.v5.js
document.addEventListener('DOMContentLoaded', function () {
    var show_candidates = false;
    // append the svg object to the body of the page
    var tooltip = d3.select("#right-explainer")
        .append("div")
        .attr("class", "tooltip")
        .html("Slå kandidater til for yderligere info");

    var svg = d3.select("#plot")
        .append("svg")
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 600 600")
        .append("g");
    var size = 600;
    //Use file political_compass.png as background
    svg.append("image")
        .attr("xlink:href", "political_compass.png")
        .attr("width", size)
        .attr("height", size);

    // Highlight the specie that is hovered
    var highlight = function (d) {
        if (show_candidates) {
            var selected_party = d.marker;

            d3.selectAll(".dot")
                .transition()
                .duration(200)
                .style("fill", "lightgrey")
                .attr("r", 2)

            d3.selectAll(".dot." + selected_party)
                .transition()
                .duration(200)
                .style("fill", d.color)
                .attr("r", 5)
        }
    }

    // Highlight the specie that is hovered
    var doNotHighlight = function () {
        if (show_candidates) {
            var highlight = d3.selectAll(".dot")
                .transition()
                .duration(200)
                .attr("r", 3.0)
                .style("fill", function (d) { return d.color; });
        }
    }

    var margin = 45;
    // Add X axis
    var x = d3.scaleLinear()
        .domain([-6.087118743025621, 6.087118743025621])
        .range([margin, size - margin]);
    // Add Y axis
    var y = d3.scaleLinear()
        .domain([-4.9057353771713395, 4.9057353771713395])
        .range([size - margin, margin]);

    /*'Københavns Omegns Storkreds', 'Sjællands Storkreds',
       'Vestjyllands Storkreds', 'Fyns Storkreds',
       'Østjyllands Storkreds', 'Nordjyllands Storkreds',
       'Københavns Storkreds', 'Nordsjællands Storkreds',
       'Sydjyllands Storkreds', 'Bornholms Storkreds'
    */
    var region = d3.scaleOrdinal().domain(['Københavns Omegns Storkreds', 'Sjællands Storkreds',
        'Vestjyllands Storkreds', 'Fyns Storkreds',
        'Østjyllands Storkreds', 'Nordjyllands Storkreds',
        'Københavns Storkreds', 'Nordsjællands Storkreds',
        'Sydjyllands Storkreds', 'Bornholms Storkreds'])
        .range([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]).unknown(0);
    //Plot a scatter plot with the two factors
    d3.csv("data.csv", function (data) {

        var tooltip_mousemove = function (d) {
            tooltip
                .html(d.name + ". Klik for mere info")
                .on("click", function () {
                    window.open(d.link);
                }
                )
        }

        var tooltip_mouseleave = function (d) {
            tooltip
                .html("Hold musen over en prik for at se kandidaten");
        }
        // Add dots
        svg.append('g')
            .selectAll("dot")
            .data(data)
            .enter()
            .append("circle")
            .attr("class", function (d) { return "dot " + d.marker + " region-" + region(d.region); })
            .attr("cx", function (d) { return x(-d.factor_1); })
            .attr("cy", function (d) { return y(d.factor_2); })
            .attr("r", 3.0)
            .style("fill", function (d) { return d.color; })
            .style("stroke", "black")
            .style("display", "none")
            .on('click', function (d) {
                window.open(d.link);
            })
            .on("mousemove", tooltip_mousemove)
            .on("mouseleave", tooltip_mouseleave)
            .on("mouseover", highlight)
            .on("mouseleave", doNotHighlight);
    }
    );
    d3.csv("data_party.csv", function (data) {
        var elem = svg.append('g')
            .selectAll("party-marker")
            .data(data)
            .enter();

        elem.append("circle")
            .attr("class", function (d) { return "party-marker " + d.marker; })
            .attr("cx", function (d) { return x(-d.factor_1); })
            .attr("cy", function (d) { return y(d.factor_2); })
            .attr("r", 10.0)
            .style("fill", function (d) { return d.color; })
            .style("stroke", "black")
            .on("mouseover", highlight)
            .on("mouseleave", doNotHighlight)
            //Add party name
            .append("svg:title")
            .text(function (d) { return d.marker; }).raise();

        elem.append("text")
            .attr("class", function (d) { return "marker " + d.marker; })
            .attr("x", function (d) { return x(-d.factor_1); })
            .attr("y", function (d) { return y(d.factor_2); })
            .attr("dy", "0.35em")
            .attr("text-anchor", "middle")
            .style("fill", "white")
            .text(function (d) { return d.marker; }).raise();
    }
    );

    var candidates_button = document.getElementById("show-candidates");
    candidates_button.addEventListener("change", function () {
        show_candidates = this.checked;
        if (this.checked) {
            d3.selectAll(".dot").style("display", "block");
            var select_region = document.getElementById("region");
            var region_value = select_region.value;
            svg.selectAll(".dot").style("display", function (d) {
                if (region(d.region) == region_value || region_value == 0) {
                    return "block";
                } else {
                    return "none";
                }
            });
            tooltip.html("Hold musen over en prik for at se kandidaten");
        } else {
            d3.selectAll(".dot").style("display", "none");
            tooltip.html("Slå kandidater til for yderligere info");
        }
    });

    //Add X marker to show personal position
    //Should still fit the x and y scale
    var x_marker = svg.append("circle")
        .attr("class", "x-marker")
        .attr("cx", x(0))
        .attr("cy", y(0))
        .attr("r", 10.0)
        .style("fill", "black")
        .style("stroke", "black").raise();
    var x_marker_text = svg.append("text")
        .attr("class", "marker")
        .attr("x", x(0))
        .attr("y", y(0))
        .attr("dy", "0.35em")
        .attr("text-anchor", "middle")
        .style("fill", "white")
        .text("X").raise();

    var blink = function () {
        x_marker.transition()
            .duration(500)
            .attr("r", 11.0)
            .style("opacity", 1.0)
            .transition()
            .duration(500)
            .attr("r", 9.0)
            .style("opacity", 0.5)
            .on("end", blink);
    }
    blink();
    var factor_component_1 = [0.25679194, 0.25117733, -0.16922805, -0.0530279, -0.20978515,
        -0.2518137, 0.19974319, -0.2332862, 0.23438802, -0.24965433,
        0.22373833, -0.15934398, 0.18598186, 0.05655807, -0.23683836,
        0.2511651, -0.1467292, 0.1584528, -0.02019529, -0.21912448,
        -0.16564275, -0.19232243, 0.23493301, 0.17187993, 0.20946947];
    var factor_component_2 = [-0.04925918, 0.07441628, 0.19144324, 0.36721104, 0.00698083,
    -0.12915873, 0.08581641, -0.16539713, -0.06070613, -0.02268533,
    -0.11701692, -0.26356794, 0.1239367, -0.20292489, -0.05408559,
    -0.03757442, 0.41427035, -0.01548188, 0.38729059, 0.22705875,
    -0.38029943, -0.20815867, -0.1579561, -0.16105272, 0.09272563];
    var questioN_stds = [1.43557317, 1.62913095, 1.52283093, 1.39689517, 1.34613626,
        1.55582701, 1.33184091, 1.52702848, 1.58107606, 1.53479762,
        1.60964349, 1.38606891, 1.63544384, 1.47226754, 1.40704831,
        1.59842385, 1.48982855, 1.47840363, 1.39678651, 1.65662041,
        1.66284302, 1.19432519, 1.51699526, 1.40571243, 1.44477894];
    var question_negation = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, -1, 1, -1, 1, 1, 1, 1, 1, 1, -1, 1, 1, 1];
    var x_pos = 0.0;
    var y_pos = 0.0;
    var question_values = [];
    var question_means = [0.35443038, -0.30955121, -0.51261468, -1.11926606, 0.9586682,
        -0.10611303, -0.98847926, 0.43583815, -0.29398148, 0.15491329,
        -0.17803468, 0.141542, 0.10034602, -0.6260069, 0.2974537,
        -0.38843931, -0.76443418, 0.24595843, -0.02078522, -0.18013857,
        -0.34526559, 0.80276817, 0.5, 0.48723898, 0.56105991];
    var sliders = [];
    var question_numbers = [];
    var party_answers_divs = document.getElementsByClassName('party-answers');
    for (var i = 0; i < party_answers_divs.length; i++) {
        party_answers_div = party_answers_divs[i];
        var q_n = party_answers_div.id.split("-")[1];
        question_numbers.push(q_n);
        var slider = document.getElementById('Q-' + q_n + '-s');
        sliders.push(slider);
        question_values.push(question_negation[q_n - 1] * (parseFloat(slider.value) - question_means[q_n - 1]) / questioN_stds[q_n - 1]);
        //question_means.push(parseFloat(slider.defaultValue));
        slider.addEventListener("input", function () {
            var q_n = parseInt(this.id.split("-")[1]);
            set_x_marker(q_n - 1, parseFloat(this.value));
        });
    }
    var question_neutral_buttons = document.getElementsByClassName('neutral-box');
    for (var i = 0; i < question_neutral_buttons.length; i++) {
        question_neutral_buttons[i].addEventListener('change', function () {
            var q_n = this.id.split('-')[1];
            var slider = document.getElementById('Q-' + q_n + '-s');
            if (this.checked) {
                set_x_marker(q_n - 1, parseFloat(slider.defaultValue));
            } else {
                set_x_marker(q_n - 1, parseFloat(slider.value));
            }
        });
    }
    function set_x_marker(i, v) {
        question_values[i] = question_negation[i] * (v - question_means[i]) / questioN_stds[i];
        update_x_marker();
    }
    function update_x_marker() {
        x_pos = 0.0;
        y_pos = 0.0;
        for (var i = 0; i < question_values.length; i++) {
            x_pos += question_values[i] * factor_component_1[i];
            y_pos += question_values[i] * factor_component_2[i];
        }
        x_marker.attr("cx", x(-x_pos));
        x_marker.attr("cy", y(y_pos));
        x_marker_text.attr("x", x(-x_pos));
        x_marker_text.attr("y", y(y_pos));
        x_marker.raise();
        x_marker_text.raise();
    }
    update_x_marker();

    var select_region = document.getElementById("region");
    select_region.addEventListener("change", function () {
        var region_value = this.value;
        svg.selectAll(".dot").style("display", function (d) {
            if (region(d.region) == region_value || region_value == 0) {
                return "block";
            } else {
                return "none";
            }
        });
        updateResults();
    });

    var party_results = document.getElementById("party-results");
    var candidate_results = document.getElementById("candidate-results");
    var party_data = [];
    var candidate_data = [];
    /*Populate the party results table with closest parties and candidates, respecting the region selection*/
    function updateResults() {
        party_data = [];
        candidate_data = [];
        var region_value = select_region.value;
        svg.selectAll(".dot").each(function (d) {
            if (region(d.region) == region_value || region_value == 0) {
                var x_diff = d.factor_1 - x_pos;
                var y_diff = d.factor_2 - y_pos;
                var distance = Math.sqrt(x_diff * x_diff + y_diff * y_diff);
                candidate_data.push({ distance: distance, marker: d.marker, name: d.name, link: d.link, color: d.color, region: d.region });
            }
        });
        svg.selectAll(".party-marker").each(function (d) {
            var x_diff = d.factor_1 - x_pos;
            var y_diff = d.factor_2 - y_pos;
            var distance = Math.sqrt(x_diff * x_diff + y_diff * y_diff);
            party_data.push({ distance: distance, marker: d.marker, party: d.party, party_color: d.color });
        });
        party_data.sort(function (a, b) {
            return a.distance - b.distance;
        });
        candidate_data.sort(function (a, b) {
            return a.distance - b.distance;
        });
        party_results.innerHTML = "<h2>Partier</h2><p class='tiny-text'>Hold musen her for at belyse</p>";
        //Add note to hover as tiny text
        candidate_results.innerHTML = "<h2>Kandidater</h2><p class='tiny-text'>Hold musen her for at belyse</p>";
        /*Parties don't have links*/
        /*To display the party symbol, simply create div with class "marker" and add color: white and background-color: party_color*/
        for (var i = 0; i < 5; i++) {
            party_results.innerHTML += '<div class="result"><div class="marker" style="background-color: ' + party_data[i].party_color + '"; color: white; display: inline-block; >' + party_data[i].marker + '</div><div class="party-name">' + party_data[i].party + '</div></div>';
            /*Add party marker for candidates as well*/
            //Important: Both middle and left click should open the link in a new tab
            candidate_results.innerHTML += '<div class="result"><div class="marker" style="background-color: ' + candidate_data[i].color + '"; color: white; display: inline-block; >' + candidate_data[i].marker + '</div><div class="party-name"><a href="' + candidate_data[i].link + '" target="_blank">' + candidate_data[i].name + '</a></div></div>';
        }
    }
    for (var i = 0; i < sliders.length; i++) {
        sliders[i].addEventListener("mouseup", updateResults);
    }

    var question_neutral_buttons = document.getElementsByClassName('neutral-box');
    for (var i = 0; i < question_neutral_buttons.length; i++) {
        question_neutral_buttons[i].addEventListener('change', updateResults);
    }

    //Highlight the top 5 parties when you hover over the party_results div
    party_results.addEventListener("mouseenter", function () {
        if (party_data.length == 0) {
            return;
        }
        svg.selectAll(".party-marker").transition().duration(200).style("opacity", 0.1);
        svg.selectAll(".dot").transition().duration(200).style("opacity", 0.1);
        for (var i = 0; i < 5; i++) {
            svg.selectAll(".party-marker." + party_data[i].marker).transition().duration(200).style("opacity", 1);
        }
    });
    party_results.addEventListener("mouseleave", function () {
        if (party_data.length == 0) {
            return;
        }
        svg.selectAll(".party-marker").transition().duration(200).style("opacity", 1);
        svg.selectAll(".dot").transition().duration(200).style("opacity", 1);
    });
    //Highlight the top 5 candidates when you hover over the candidate_results div
    candidate_results.addEventListener("mouseenter", function () {
        if (candidate_data.length == 0 || candidates_button.checked == false) {
            return;
        }
        svg.selectAll(".dot").transition().duration(200).style("opacity", 0.1).attr("r", 1);
        svg.selectAll(".party-marker").transition().duration(200).style("opacity", 0.1);
        x_marker.style("display", "none");
        x_marker_text.style("fill", "black");
        for (var i = 0; i < 5; i++) {
            //Name == data[i].name
            let region_filter = "";
            if (select_region.value != 0) {
                region_filter = ".region-" + region(candidate_data[i].region);
            }
            let dots = svg.selectAll(".dot." + candidate_data[i].marker + region_filter).filter(function (d) {
                return d.name == candidate_data[i].name;
            });
            dots.transition().duration(200).style("opacity", 1).attr("r", 5);
        }
    });
    candidate_results.addEventListener("mouseleave", function () {
        if (candidate_data.length == 0 || candidates_button.checked == false) {
            return;
        }
        svg.selectAll(".dot").transition().duration(200).style("opacity", 1).attr("r", 3);
        svg.selectAll(".party-marker").transition().duration(200).style("opacity", 1);
        x_marker.style("display", "block");
        x_marker_text.style("fill", "white");
    });
});