import json
import yaml
import os
from django.core.management.base import BaseCommand
from django.core.management import call_command


class Command(BaseCommand):
    help = 'Dump data from the specified app into a YAML file'

    def add_arguments(self, parser):
        parser.add_argument('app_label', type=str, help='The app label of the application to dump data from')
        parser.add_argument('output_file', type=str, help='The output YAML file')
        parser.add_argument('--model', type=str, help='Optional specific model to dump data from', required=False)

    def handle(self, *args, **options):
        app_label = options['app_label']
        output_file = options['output_file']
        model = options.get('model')
        json_file = 'temp_data.json'

        self.stdout.write(f'Dumping data from {app_label} to JSON...')
        with open(json_file, 'w') as f:
            if model:
                call_command('dumpdata', f'{app_label}.{model}', stdout=f)
            else:
                call_command('dumpdata', app_label, stdout=f)

        self.stdout.write(f'Converting JSON to YAML...')
        with open(json_file, 'r') as json_f:
            data = json.load(json_f)

        with open(output_file, 'w') as yaml_f:
            yaml.dump(data, yaml_f, default_flow_style=False, allow_unicode=True, sort_keys=False)

        os.remove(json_file)
        self.stdout.write(self.style.SUCCESS(f'Data dumped to {output_file}'))
