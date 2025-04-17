from flask import Flask, render_template, send_file
import csv

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/export', methods=['GET'])
def export_entities():
    with open('entities.csv', 'w', newline='') as csvfile:
        fieldnames = ['id', 'name', 'type', 'description']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

        writer.writeheader()
        for entity in entities:
            writer.writerow(entity)

    return send_file('entities.csv', as_attachment=True)

if __name__ == '__main__':
    app.run(debug=True)

