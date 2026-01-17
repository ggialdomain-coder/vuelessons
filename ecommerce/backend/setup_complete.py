"""
Complete setup script for Django backend
Run this once to set up everything
"""
import os
import sys
import subprocess

def run_command(command, description):
    """Run a command and print status"""
    print(f"\n{'='*50}")
    print(f"Step: {description}")
    print(f"Running: {command}")
    print('='*50)
    
    result = subprocess.run(command, shell=True, capture_output=True, text=True)
    
    if result.returncode == 0:
        print(f"✅ Success: {description}")
        if result.stdout:
            print(result.stdout)
    else:
        print(f"❌ Error: {description}")
        if result.stderr:
            print(result.stderr)
        return False
    return True

def main():
    print("\n" + "="*60)
    print("Django Backend Setup Script")
    print("="*60)
    
    # Check if virtual environment exists
    if not os.path.exists('venv'):
        print("\n📦 Creating virtual environment...")
        if not run_command('python -m venv venv', 'Create virtual environment'):
            print("\n⚠️  Trying with python3...")
            run_command('python3 -m venv venv', 'Create virtual environment')
    
    # Activate virtual environment and install dependencies
    if sys.platform == 'win32':
        activate_cmd = 'venv\\Scripts\\activate'
        pip_cmd = 'venv\\Scripts\\pip'
        python_cmd = 'venv\\Scripts\\python'
    else:
        activate_cmd = 'source venv/bin/activate'
        pip_cmd = 'venv/bin/pip'
        python_cmd = 'venv/bin/python'
    
    print("\n📥 Installing dependencies...")
    run_command(f'{pip_cmd} install -r requirements.txt', 'Install dependencies')
    
    print("\n🗄️  Creating database...")
    run_command(f'{python_cmd} manage.py migrate', 'Run migrations')
    
    print("\n👤 Creating default admin user...")
    run_command(f'{python_cmd} manage.py create_default_admin', 'Create admin user')
    
    print("\n📦 Creating sample data...")
    run_command(f'{python_cmd} manage.py create_sample_data', 'Create sample data')
    
    print("\n" + "="*60)
    print("✅ Setup Complete!")
    print("="*60)
    print("\n📋 Admin Credentials:")
    print("   Username: admin")
    print("   Password: admin123")
    print("\n🔗 Admin Panel: http://localhost:8000/admin/")
    print("🔗 API Base: http://localhost:8000/api/")
    print("\n🚀 To start the server, run:")
    if sys.platform == 'win32':
        print("   python manage.py runserver")
    else:
        print("   python3 manage.py runserver")
    print("\n" + "="*60)

if __name__ == '__main__':
    main()












