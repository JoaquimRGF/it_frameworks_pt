from flask import Flask, render_template
from flask_bootstrap import Bootstrap
from flask import request
import os

app = Flask(__name__)
Bootstrap(app)

@app.route('/')
def home():
    return render_template("home.html")

@app.route('/about')
def about():
    return render_template("about.html")

@app.route('/plot', methods=['GET', 'POST'])
def plot():

    search = {
        "JavaScript": ['React', 'Angular', 'Vue', 'jQuery', 'Ember'],
        "Python": ['Tornado', 'Django','Flask'],
        "Java": ['Spring MVC', 'Struts', 'Grails', 'JSF', 'Hibernate'],
        "PHP": ['Laravel', 'Symfony', 'CodeIgniter', 'Zend', 'Slim', 'Yii 2']
    }

    languages = [i for i in search]

    if request.method == 'POST':
            lng = request.get_data().decode('utf-8')
    else:
        lng = languages[0]

    import requests
    from flask import jsonify
    from bs4 import BeautifulSoup

    data_results = []
    try:
        for s in search[lng]:
            
            try:
                r = requests.get("https://www.itjobs.pt/emprego?q={}".format(s), headers={'User-agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:61.0) Gecko/20100101 Firefox/61.0'})
                c = r.content

                soup = BeautifulSoup(c, "html.parser")

                result_search = soup.find("small").text

                value = result_search.split(" ")[0]

                data_results.append({'name': s, "value": value})
            except:
                continue

        data_final = [languages, data_results]
        return jsonify(data_final)
    except:
        message = {
            "error": "Aconteceu um erro, seleciona outra linguagem"
        }
        return jsonify(message)

    

if __name__=="__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(debug=True, port=port)