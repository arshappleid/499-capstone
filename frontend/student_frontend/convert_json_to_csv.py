import json
import csv

with open('dependencies.json') as json_file:
    data = json.load(json_file)

dependencies = data.get('dependencies', {})

with open('student_frontend_dependencies.csv', 'w', newline='') as csv_file:
    csv_writer = csv.writer(csv_file)
    csv_writer.writerow(['Dependency Name', 'Version', 'Link'])

    for dependency, info in dependencies.items():
        version = info['version']
        link = f'https://www.npmjs.com/package/{dependency}'
        csv_writer.writerow([dependency, version, '=HYPERLINK("%s", "link")' % link])
