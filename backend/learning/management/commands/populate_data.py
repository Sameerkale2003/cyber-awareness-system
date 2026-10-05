from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from learning.models import Category, Module, Lesson, CyberTip
from quizzes.models import Quiz, Question, Answer
from progress.models import Achievement

User = get_user_model()


class Command(BaseCommand):
    help = 'Populate the database with initial cyber awareness content'

    def handle(self, *args, **options):
        self.stdout.write(self.style.MIGRATE_HEADING('\n[+] Populating Cyber Awareness System...\n'))

        self._create_categories()
        self._create_modules()
        self._create_tips()
        self._create_quizzes()
        self._create_achievements()
        self._create_admin_user()

        self.stdout.write(self.style.SUCCESS('\n[OK] Database populated successfully!\n'))

    # ─────────────────────────────────────────────
    def _create_categories(self):
        self.stdout.write('  Creating categories...')
        categories = [
            {'name': 'Password Security', 'icon': '🔑', 'color': '#e74c3c', 'order': 1,
             'description': 'Learn how to create and manage strong passwords.'},
            {'name': 'Personal Data Protection', 'icon': '🛡️', 'color': '#3498db', 'order': 2,
             'description': 'Protect your personal information online.'},
            {'name': 'Cyber Safety', 'icon': '💡', 'color': '#2ecc71', 'order': 3,
             'description': 'Essential tips to stay safe in the digital world.'},
            {'name': 'Phishing Awareness', 'icon': '🎣', 'color': '#f39c12', 'order': 4,
             'description': 'Recognize and avoid phishing attacks.'},
            {'name': 'Social Media Safety', 'icon': '📱', 'color': '#9b59b6', 'order': 5,
             'description': 'Stay safe and private on social media platforms.'},
            {'name': 'Network Security', 'icon': '🌐', 'color': '#1abc9c', 'order': 6,
             'description': 'Secure your network and internet connections.'},
        ]
        for cat_data in categories:
            Category.objects.get_or_create(name=cat_data['name'], defaults=cat_data)
        self.stdout.write(self.style.SUCCESS(f'    [OK] {len(categories)} categories created'))

    # ─────────────────────────────────────────────
    def _create_modules(self):
        self.stdout.write('  Creating modules and lessons...')

        pwd_cat = Category.objects.get(name='Password Security')
        data_cat = Category.objects.get(name='Personal Data Protection')
        cyber_cat = Category.objects.get(name='Cyber Safety')
        phish_cat = Category.objects.get(name='Phishing Awareness')
        social_cat = Category.objects.get(name='Social Media Safety')
        net_cat = Category.objects.get(name='Network Security')

        modules_data = [
            {
                'title': 'Password Hygiene Basics',
                'description': 'Learn what password hygiene means and why it matters for protecting your online accounts from unauthorized access.',
                'category': pwd_cat,
                'difficulty': 'beginner',
                'duration_minutes': 10,
                'order': 1,
                'lessons': [
                    {
                        'title': 'What is Password Hygiene?',
                        'content': '''## 🔑 What is Password Hygiene?

Password hygiene means using strong and secure passwords to protect your online accounts from unauthorized access.

### Why It Matters
Every day, millions of accounts are compromised because of weak or reused passwords. Your password is the first line of defense.

### Key Principles:
1. **Use Strong Passwords** — Combine uppercase letters, lowercase letters, numbers and special characters (e.g., `C@tSk!ll$99`)
2. **Avoid Common Passwords** — Do not use passwords like `123456`, `password`, your name, or date of birth
3. **Change Compromised Passwords** — If your password is exposed or stolen, change it immediately
4. **Never Reuse Passwords** — Each account should have a unique password

### Password Do's and Don'ts:
| ✅ Do | ❌ Don't |
|-------|----------|
| Use 12+ characters | Use your birthday |
| Mix character types | Use dictionary words |
| Use a password manager | Share passwords with anyone |
| Enable 2FA | Write passwords on sticky notes |

> 💡 **Tip:** A passphrase like `Purple!Elephant$Runs@Fast` is long, memorable, and strong!
''',
                        'order': 1,
                        'lesson_type': 'text',
                    },
                    {
                        'title': 'Creating Strong Passwords',
                        'content': '''## 💪 Creating Strong Passwords

### The Anatomy of a Strong Password

A strong password should have **ALL** of the following:
- ✅ At least **12 characters** long (longer is better)
- ✅ At least one **UPPERCASE** letter (A-Z)
- ✅ At least one **lowercase** letter (a-z)
- ✅ At least one **number** (0-9)
- ✅ At least one **special character** (!@#$%^&*)

### Examples:
| Weak ❌ | Strong ✅ |
|---------|----------|
| `john1990` | `J0hN!@#1990Sec` |
| `password` | `P@$$w0rd!SecuRe` |
| `123456` | `Tr0ub4dor&3` |
| `qwerty` | `Qw3rTy!@#Secure` |

### Password Manager Tips:
Use a reputable password manager (like Bitwarden or 1Password) to:
- Generate strong random passwords
- Store them securely
- Auto-fill on websites

### The Passphrase Method:
Pick 4+ random words: `Correct-Horse-Battery-Staple!`
This is both long AND memorable!
''',
                        'order': 2,
                        'lesson_type': 'text',
                    },
                    {
                        'title': 'Password Manager Guide',
                        'content': '''## 🔐 Using a Password Manager

### What is a Password Manager?
A password manager is a secure app that stores all your passwords in an encrypted vault. You only need to remember **one master password**.

### Benefits:
- 🔒 Stores passwords with AES-256 encryption
- 🎲 Generates strong random passwords
- 🔄 Auto-fills login forms
- 📱 Syncs across all your devices
- 🚨 Alerts you about breached passwords

### Recommended (Free) Options:
1. **Bitwarden** — Open-source, free tier available
2. **KeePassXC** — Offline, completely free
3. **Dashlane** — Free tier available

### Getting Started:
1. Choose a password manager
2. Create a STRONG master password (use passphrase method!)
3. Import or manually add your accounts
4. Enable two-factor authentication on the manager itself
5. Replace weak passwords one account at a time

> ⚠️ **Warning:** Never forget your master password! Store a recovery key in a safe physical location.
''',
                        'order': 3,
                        'lesson_type': 'text',
                    },
                ],
            },
            {
                'title': 'Personal Data Protection Fundamentals',
                'description': 'Personal data includes your name, phone number, email, photographs, location, and financial information. Learn how to protect it.',
                'category': data_cat,
                'difficulty': 'beginner',
                'duration_minutes': 12,
                'order': 1,
                'lessons': [
                    {
                        'title': 'What is Personal Data?',
                        'content': '''## 🛡️ What is Personal Data?

Personal data includes any information that can identify you as an individual.

### Types of Personal Data:
| Category | Examples |
|----------|----------|
| **Identity** | Full name, date of birth, ID number |
| **Contact** | Email address, phone number, home address |
| **Financial** | Bank account, credit card, salary info |
| **Digital** | IP address, browser history, cookies |
| **Biometric** | Fingerprints, facial recognition data |
| **Location** | GPS coordinates, home/work address |

### ⚠️ Remember:
> **Never share sensitive personal information with unknown people or suspicious websites.**

### Protect Your Personal Data:
- ❌ Do not share OTPs or passwords
- ✅ Check website links before entering information (look for HTTPS 🔒)
- ✅ Use privacy settings on social media
- ❌ Avoid sharing unnecessary personal information online
- ✅ Keep your phone and applications updated
- ✅ Use different email addresses for different purposes
''',
                        'order': 1,
                        'lesson_type': 'text',
                    },
                    {
                        'title': 'HTTPS and Secure Websites',
                        'content': '''## 🔒 How to Identify Secure Websites

### The HTTPS Lock Icon
Before entering any personal information, always check:
1. The URL starts with **https://** (not http://)
2. There is a **lock icon** 🔒 in the address bar
3. The domain name is spelled correctly

### Red Flags to Watch For:
- 🚨 URL has misspellings: `paypa1.com` instead of `paypal.com`
- 🚨 Padlock is broken or missing
- 🚨 Security certificate warning in browser
- 🚨 Website asks for more info than needed

### Checking a Website's Safety:
1. **Google Safe Browsing**: `https://safebrowsing.google.com/safebrowsing/report_phish/`
2. **VirusTotal**: Scan any URL at `virustotal.com`
3. **WhoIs Lookup**: Check who owns the domain

> 💡 **Tip:** Bookmark important websites instead of clicking links from emails!
''',
                        'order': 2,
                        'lesson_type': 'text',
                    },
                ],
            },
            {
                'title': 'Cyber Safety Essentials',
                'description': 'Master the essential cyber safety habits that protect your digital identity every day.',
                'category': cyber_cat,
                'difficulty': 'beginner',
                'duration_minutes': 15,
                'order': 1,
                'lessons': [
                    {
                        'title': 'Two-Factor Authentication (2FA)',
                        'content': '''## 🔐 Two-Factor Authentication (2FA)

### What is 2FA?
Two-factor authentication adds an **extra layer of security** beyond your password.

Even if someone steals your password, they still can't access your account without the second factor.

### The 3 Types of Authentication Factors:
1. **Something you KNOW** — Password or PIN
2. **Something you HAVE** — Phone (SMS code, authenticator app)
3. **Something you ARE** — Fingerprint, facial recognition

### How to Enable 2FA:
1. Go to your account **Security Settings**
2. Find **Two-Factor Authentication** or **2-Step Verification**
3. Choose your method (Authenticator App is most secure!)
4. Follow the setup steps
5. Save your **backup codes** in a safe place

### Best 2FA Apps:
- 📱 **Google Authenticator** (free)
- 📱 **Microsoft Authenticator** (free)
- 📱 **Authy** (free, with backup)

### Accounts That NEED 2FA:
- ✅ Email accounts
- ✅ Banking / Financial apps
- ✅ Social media
- ✅ Password manager
- ✅ Work accounts

> ⚠️ **NEVER share your 2FA codes with anyone, even if they claim to be from support!**
''',
                        'order': 1,
                        'lesson_type': 'text',
                    },
                    {
                        'title': 'Safe Browsing Habits',
                        'content': '''## 🌐 Safe Browsing Habits

### Top Rules for Safe Browsing:

#### 1. Don't Click Suspicious Links
- Hover over links to see the real URL before clicking
- Be skeptical of shortened URLs (bit.ly, tinyurl.com)
- If in doubt, type the URL directly into your browser

#### 2. Don't Download from Unknown Sources
- Only download from official app stores or official websites
- Verify the file before opening (scan with antivirus)
- Be wary of executable files (.exe, .bat, .msi)

#### 3. Log Out from Public or Shared Devices
- Always log out of all accounts
- Never save passwords on shared computers
- Clear browser history/cookies after use
- Use private/incognito mode on shared devices

#### 4. Keep Software Updated
- Enable automatic updates for your OS
- Update browsers and plugins regularly
- Update antivirus definitions daily

#### 5. Use Secure Connections
- Avoid using public Wi-Fi for sensitive activities
- Use a VPN when on public networks
- Prefer mobile data over unknown Wi-Fi

### The Golden Rule:
> **"When in doubt, don't click it out!"**
''',
                        'order': 2,
                        'lesson_type': 'text',
                    },
                ],
            },
            {
                'title': 'Recognizing Phishing Attacks',
                'description': 'Learn how to spot and avoid phishing emails, fake websites, and social engineering attacks.',
                'category': phish_cat,
                'difficulty': 'intermediate',
                'duration_minutes': 20,
                'order': 1,
                'lessons': [
                    {
                        'title': 'What is Phishing?',
                        'content': '''## 🎣 What is Phishing?

Phishing is a cyberattack where criminals **pretend to be a trusted entity** to trick you into revealing sensitive information.

### Types of Phishing:
| Type | Description |
|------|-------------|
| **Email Phishing** | Fake emails pretending to be banks, services |
| **Spear Phishing** | Targeted attack using personal information |
| **Smishing** | Phishing via SMS text messages |
| **Vishing** | Phishing via voice calls |
| **Clone Phishing** | Copy of a real email with malicious links |

### How to Spot a Phishing Email:

**Check the SENDER:**
- Does the domain match? `support@paypa1.com` ≠ PayPal!
- Is it from a free email address? `paypal@gmail.com` is fake!

**Check the CONTENT:**
- Creates urgency: "Your account will be suspended in 24 hours!"
- Generic greetings: "Dear Customer" instead of your name
- Asks for sensitive information (passwords, SSN, card numbers)
- Contains spelling/grammar mistakes

**Check the LINKS:**
- Hover before clicking to see real URL
- URL doesn't match the claimed organization

### What to Do if You Get a Phishing Email:
1. ❌ Do NOT click any links
2. ❌ Do NOT open attachments
3. ❌ Do NOT reply with any information
4. ✅ Report it as phishing in your email client
5. ✅ Delete the email
6. ✅ If you clicked, change your passwords immediately!
''',
                        'order': 1,
                        'lesson_type': 'text',
                    },
                ],
            },
            {
                'title': 'Social Media Safety',
                'description': 'Learn to protect your privacy and safety on social media platforms like Facebook, Instagram, and Twitter.',
                'category': social_cat,
                'difficulty': 'beginner',
                'duration_minutes': 12,
                'order': 1,
                'lessons': [
                    {
                        'title': 'Privacy Settings on Social Media',
                        'content': '''## 📱 Social Media Privacy Settings

### Why Privacy Settings Matter
By default, most social media platforms share your information publicly. Take control!

### Facebook Privacy Checklist:
- ✅ Set profile visibility to **Friends Only**
- ✅ Disable **facial recognition**
- ✅ Review what **apps** have access to your account
- ✅ Turn off **location sharing**
- ✅ Review your **ad preferences**

### Instagram Privacy Checklist:
- ✅ Set account to **Private**
- ✅ Remove tagged photos you don't want
- ✅ Limit who can send you **direct messages**
- ✅ Turn off **activity status**

### What NOT to Share on Social Media:
- 🚫 Your home address
- 🚫 Phone number (unless business)
- 🚫 Date of birth (full)
- 🚫 Vacation plans (lets people know you're away)
- 🚫 Photos of children at school with location
- 🚫 Financial information
- 🚫 Government ID numbers

### The Oversharing Test:
Before posting, ask yourself:
1. Could this help someone find me physically?
2. Could this be used against me?
3. Would I be comfortable if my employer saw this?
''',
                        'order': 1,
                        'lesson_type': 'text',
                    },
                ],
            },
            {
                'title': 'Network Security Basics',
                'description': 'Understand how to secure your home network and stay safe on public Wi-Fi.',
                'category': net_cat,
                'difficulty': 'intermediate',
                'duration_minutes': 18,
                'order': 1,
                'lessons': [
                    {
                        'title': 'Securing Your Home Network',
                        'content': '''## 🌐 Securing Your Home Network

### Your Router: The Gateway to Your Home Network

#### Step 1: Change Default Credentials
Your router comes with a default username/password (often `admin/admin`).
Change this immediately!
- Go to your router's admin page (usually `192.168.1.1`)
- Find the admin password setting
- Set a strong, unique password

#### Step 2: Use WPA3 or WPA2 Encryption
- In router settings, find **Wireless Security**
- Set to **WPA3** (or WPA2 if WPA3 not available)
- NEVER use WEP — it's completely broken

#### Step 3: Set a Strong Wi-Fi Password
- Use 16+ characters with mixed types
- Change it every 6-12 months

#### Step 4: Enable Firewall
- Most routers have a built-in firewall
- Make sure it's enabled!

#### Step 5: Update Router Firmware
- Check for firmware updates regularly
- Enable auto-update if available

### Public Wi-Fi Safety:
| Do ✅ | Don't ❌ |
|-------|----------|
| Use a VPN | Do online banking |
| Browse HTTPS sites only | Enter passwords |
| Forget the network after use | Access sensitive accounts |
| Use mobile data for banking | Leave sharing enabled |
''',
                        'order': 1,
                        'lesson_type': 'text',
                    },
                ],
            },
        ]

        count = 0
        for mod_data in modules_data:
            lessons_data = mod_data.pop('lessons')
            module, created = Module.objects.get_or_create(
                title=mod_data['title'],
                defaults=mod_data
            )
            if created:
                for lesson_data in lessons_data:
                    Lesson.objects.create(module=module, **lesson_data)
                count += 1

        self.stdout.write(self.style.SUCCESS(f'    [OK] {count} modules with lessons created'))

    # ─────────────────────────────────────────────
    def _create_tips(self):
        self.stdout.write('  Creating cyber tips...')
        pwd_cat = Category.objects.get(name='Password Security')
        data_cat = Category.objects.get(name='Personal Data Protection')
        cyber_cat = Category.objects.get(name='Cyber Safety')
        phish_cat = Category.objects.get(name='Phishing Awareness')
        social_cat = Category.objects.get(name='Social Media Safety')
        net_cat = Category.objects.get(name='Network Security')

        tips = [
            # Password tips
            {'title': 'Use Strong Passwords', 'icon': '✅', 'category': pwd_cat, 'is_featured': True,
             'content': 'Use a combination of uppercase letters, lowercase letters, numbers, and special characters. A strong password is at least 12 characters long. Example: `Tr0ub4dor&3!`'},
            {'title': 'Avoid Common Passwords', 'icon': '❌', 'category': pwd_cat, 'is_featured': True,
             'content': 'Do not use passwords like 123456, password, your name, or your date of birth. These are the first passwords attackers try in a brute-force attack.'},
            {'title': 'Change Compromised Passwords', 'icon': '🔄', 'category': pwd_cat, 'is_featured': False,
             'content': 'If your password is exposed or stolen (e.g., in a data breach), change it immediately. Use haveibeenpwned.com to check if your email has been in a breach.'},
            {'title': 'Use a Password Manager', 'icon': '🔐', 'category': pwd_cat, 'is_featured': False,
             'content': 'A password manager stores all your passwords securely. You only need to remember one master password. Recommended: Bitwarden (free and open-source).'},
            {'title': 'Never Reuse Passwords', 'icon': '🚫', 'category': pwd_cat, 'is_featured': False,
             'content': 'Using the same password on multiple sites means one breach compromises all your accounts. Each account should have a unique, strong password.'},
            # Data protection tips
            {'title': 'Never Share OTPs or Passwords', 'icon': '🛡️', 'category': data_cat, 'is_featured': True,
             'content': 'One-Time Passwords (OTPs) are for YOUR eyes only. Legitimate organizations like banks will NEVER ask for your OTP, PIN, or full password over phone or email.'},
            {'title': 'Check Website Links', 'icon': '🔗', 'category': data_cat, 'is_featured': True,
             'content': 'Before entering any personal information, verify the website URL starts with https:// and has a padlock icon. Check for misspellings in the domain name.'},
            {'title': 'Use Privacy Settings on Social Media', 'icon': '📱', 'category': social_cat, 'is_featured': True,
             'content': 'Review and tighten privacy settings on all social media platforms. Set your profile to private and limit who can see your posts, photos, and personal information.'},
            {'title': 'Avoid Sharing Unnecessary Personal Info', 'icon': '🤐', 'category': data_cat, 'is_featured': False,
             'content': 'Think before you share. Ask yourself: Does this website/app really need my date of birth, phone number, or address? Share only what is absolutely necessary.'},
            {'title': 'Keep Apps and Phone Updated', 'icon': '📲', 'category': cyber_cat, 'is_featured': False,
             'content': 'Software updates often include critical security patches. Enable automatic updates on your phone and computer to protect against the latest threats.'},
            # Cyber safety tips
            {'title': 'Enable Two-Factor Authentication', 'icon': '🔑', 'category': cyber_cat, 'is_featured': True,
             'content': 'Enable 2FA on all important accounts — especially email, banking, and social media. Even if someone steals your password, they cannot access your account without the second factor.'},
            {'title': 'Use Different Passwords for Important Accounts', 'icon': '🗝️', 'category': pwd_cat, 'is_featured': False,
             'content': 'Your email and banking accounts should have the strongest, most unique passwords. These are the keys to your digital life — if they are compromised, everything else is at risk.'},
            {'title': 'Do Not Click Suspicious Links', 'icon': '⚠️', 'category': phish_cat, 'is_featured': True,
             'content': 'Hover over links to see their actual destination before clicking. Be especially wary of links in emails, text messages, and social media messages from unknown senders.'},
            {'title': 'Do Not Download from Unknown Sources', 'icon': '⬇️', 'category': cyber_cat, 'is_featured': False,
             'content': 'Only download software and files from trusted, official sources. Downloads from unknown websites may contain malware, ransomware, or spyware.'},
            {'title': 'Log Out from Public Devices', 'icon': '🚪', 'category': cyber_cat, 'is_featured': True,
             'content': 'Always log out of all accounts after using a public or shared computer. Clear the browser cache and history. Never save passwords on public devices.'},
            {'title': 'Review Account Privacy Settings Regularly', 'icon': '⚙️', 'category': social_cat, 'is_featured': False,
             'content': 'Schedule a monthly "privacy audit" — review your social media privacy settings, check app permissions, and review which third-party apps have access to your accounts.'},
            {'title': 'Secure Your Home Wi-Fi', 'icon': '📡', 'category': net_cat, 'is_featured': False,
             'content': 'Change your router\'s default username and password. Use WPA3 or WPA2 encryption. Set a strong Wi-Fi password and keep your router firmware updated.'},
        ]

        count = 0
        for tip_data in tips:
            _, created = CyberTip.objects.get_or_create(title=tip_data['title'], defaults=tip_data)
            if created:
                count += 1

        self.stdout.write(self.style.SUCCESS(f'    [OK] {count} cyber tips created'))

    # ─────────────────────────────────────────────
    def _create_quizzes(self):
        self.stdout.write('  Creating quizzes...')

        quizzes_data = [
            {
                'title': 'Password Security Quiz',
                'description': 'Test your knowledge about password best practices and security.',
                'passing_score': 70,
                'time_limit_minutes': 10,
                'questions': [
                    {
                        'text': 'What is the minimum recommended length for a strong password?',
                        'type': 'multiple_choice',
                        'points': 10,
                        'answers': [
                            ('6 characters', False, 'Too short — can be cracked easily.'),
                            ('8 characters', False, '8 characters is the old standard. Modern recommendations are higher.'),
                            ('12 characters', True, 'Correct! 12+ characters is the current recommended minimum.'),
                            ('4 characters', False, 'Never use 4-character passwords — they are extremely weak.'),
                        ]
                    },
                    {
                        'text': 'Which of the following is an example of a STRONG password?',
                        'type': 'multiple_choice',
                        'points': 10,
                        'answers': [
                            ('password123', False, 'This is one of the most common passwords and is extremely weak.'),
                            ('john1990', False, 'Using your name and birth year is easily guessable.'),
                            ('Tr0ub4dor&3!', True, 'Correct! This uses a mix of uppercase, lowercase, numbers, and special characters.'),
                            ('qwerty', False, 'Keyboard patterns are easy to guess and very common.'),
                        ]
                    },
                    {
                        'text': 'True or False: It is safe to use the same password for multiple accounts if it is a strong password.',
                        'type': 'true_false',
                        'points': 10,
                        'answers': [
                            ('True', False, 'False! If one site is breached, all your accounts become vulnerable. Always use unique passwords.'),
                            ('False', True, 'Correct! Never reuse passwords. Each account should have a unique password.'),
                        ]
                    },
                    {
                        'text': 'What should you do if you discover your password has been exposed in a data breach?',
                        'type': 'multiple_choice',
                        'points': 10,
                        'answers': [
                            ('Wait and see if anything happens', False, 'Waiting is dangerous — attackers act fast after breaches.'),
                            ('Change it immediately on all affected accounts', True, 'Correct! Act immediately and change the password on every account where you used it.'),
                            ('Add a number to the end of the old password', False, 'This is not secure — attackers can easily guess variations.'),
                            ('Nothing, strong passwords cannot be breached', False, 'Even strong passwords can be exposed if the server storing them is compromised.'),
                        ]
                    },
                    {
                        'text': 'What is a password manager?',
                        'type': 'multiple_choice',
                        'points': 10,
                        'answers': [
                            ('A person who manages passwords for a company', False, 'That would be an IT administrator.'),
                            ('A notebook where you write down passwords', False, 'Written passwords are a security risk if lost or stolen.'),
                            ('An encrypted app that stores and generates passwords securely', True, 'Correct! Password managers store passwords with strong encryption.'),
                            ('A browser feature that remembers passwords in plain text', False, 'Browser password storage is less secure than a dedicated password manager.'),
                        ]
                    },
                ]
            },
            {
                'title': 'Personal Data Protection Quiz',
                'description': 'How well do you protect your personal information online?',
                'passing_score': 70,
                'time_limit_minutes': 10,
                'questions': [
                    {
                        'text': 'A bank calls you and asks for your OTP to verify your account. What should you do?',
                        'type': 'multiple_choice',
                        'points': 10,
                        'answers': [
                            ('Provide the OTP — the bank needs it to help you', False, 'NEVER share OTPs! Legitimate banks will NEVER ask for your OTP over the phone.'),
                            ('Hang up and call your bank using the official number', True, 'Correct! Hang up, then call the bank directly using the number on their official website or your card.'),
                            ('Ask them to send an email instead', False, 'Still suspicious — do not engage. Contact the bank yourself using official channels.'),
                            ('Give them only part of the OTP', False, 'Never share any part of an OTP with anyone.'),
                        ]
                    },
                    {
                        'text': 'What does HTTPS in a web address indicate?',
                        'type': 'multiple_choice',
                        'points': 10,
                        'answers': [
                            ('The website is 100% safe and legitimate', False, 'HTTPS only means the connection is encrypted, not that the website itself is safe.'),
                            ('The connection between you and the website is encrypted', True, 'Correct! HTTPS uses SSL/TLS to encrypt data in transit.'),
                            ('The website has been verified by the government', False, 'HTTPS is not a government verification.'),
                            ('The website is faster than HTTP sites', False, 'HTTPS is about security, not primarily about speed.'),
                        ]
                    },
                    {
                        'text': 'True or False: It is safe to share your full date of birth on social media profiles.',
                        'type': 'true_false',
                        'points': 10,
                        'answers': [
                            ('True', False, 'False! Date of birth is commonly used to verify identity — sharing it publicly helps attackers answer security questions.'),
                            ('False', True, 'Correct! Your full date of birth is sensitive. Share only the day and month if you want birthday wishes.'),
                        ]
                    },
                    {
                        'text': 'Which of the following is considered personal data?',
                        'type': 'multiple_choice',
                        'points': 10,
                        'answers': [
                            ('Only your government ID number', False, 'Personal data is much broader than just ID numbers.'),
                            ('Your name, email, phone, location, and financial info', True, 'Correct! All of these are personal data that must be protected.'),
                            ('Only your banking information', False, 'Personal data includes all identifying information, not just financial.'),
                            ('Only photos and videos', False, 'Photos are personal data, but so is much more.'),
                        ]
                    },
                    {
                        'text': 'What should you do before entering your credit card details on a website?',
                        'type': 'multiple_choice',
                        'points': 10,
                        'answers': [
                            ('Nothing — if the website looks professional, it is safe', False, 'Fake websites can look very professional. Always verify!'),
                            ('Check for HTTPS, verify the domain, and use a known payment gateway', True, 'Correct! Always verify the connection and domain before entering payment details.'),
                            ('Ask a friend if they have used the website', False, 'While asking is helpful, you should always verify yourself.'),
                            ('Check if the site has many products listed', False, 'The number of products has nothing to do with security.'),
                        ]
                    },
                ]
            },
            {
                'title': 'General Cyber Awareness Quiz',
                'description': 'A comprehensive test covering all aspects of cyber safety and awareness.',
                'passing_score': 60,
                'time_limit_minutes': 15,
                'questions': [
                    {
                        'text': 'What is Two-Factor Authentication (2FA)?',
                        'type': 'multiple_choice',
                        'points': 10,
                        'answers': [
                            ('Using two different browsers', False, 'This has nothing to do with authentication.'),
                            ('Having two different passwords', False, 'Two passwords would be confusing and is not 2FA.'),
                            ('A security process requiring two forms of verification to access an account', True, 'Correct! 2FA requires something you know (password) plus something you have or are.'),
                            ('Logging in twice for extra security', False, 'Logging in twice does not provide extra security.'),
                        ]
                    },
                    {
                        'text': 'You receive an email from "support@paypa1.com" asking you to verify your PayPal account. This is most likely:',
                        'type': 'multiple_choice',
                        'points': 10,
                        'answers': [
                            ('A legitimate email from PayPal', False, 'PayPal\'s official domain is paypal.com. Notice the "1" instead of "l" in the fake domain.'),
                            ('A phishing attack', True, 'Correct! The misspelled domain (paypa1.com) is a classic phishing sign.'),
                            ('A security notification', False, 'Security notifications come from the real domain, not a misspelled one.'),
                            ('A spam email trying to sell something', False, 'This is specifically a phishing attack designed to steal your credentials.'),
                        ]
                    },
                    {
                        'text': 'True or False: Using public Wi-Fi is completely safe for online banking if you use HTTPS websites.',
                        'type': 'true_false',
                        'points': 10,
                        'answers': [
                            ('True', False, 'Public Wi-Fi carries risks even with HTTPS. Attackers can set up fake hotspots (evil twin attacks).'),
                            ('False', True, 'Correct! Avoid banking on public Wi-Fi. Use mobile data or a VPN.'),
                        ]
                    },
                    {
                        'text': 'What is phishing?',
                        'type': 'multiple_choice',
                        'points': 10,
                        'answers': [
                            ('A type of computer virus', False, 'Phishing is social engineering, not a virus.'),
                            ('A cyber attack that tricks people into revealing sensitive information', True, 'Correct! Phishing uses deception to steal credentials and personal data.'),
                            ('Unauthorized access to a computer system', False, 'That would be hacking or unauthorized access.'),
                            ('Encrypting files and demanding ransom', False, 'That describes ransomware.'),
                        ]
                    },
                    {
                        'text': 'True or False: You should log out of accounts after using a shared or public computer.',
                        'type': 'true_false',
                        'points': 10,
                        'answers': [
                            ('True', True, 'Correct! Always log out of all accounts on shared/public computers and clear browsing data.'),
                            ('False', False, 'Always log out! Failing to do so leaves your account accessible to the next user.'),
                        ]
                    },
                    {
                        'text': 'What is the safest way to download software?',
                        'type': 'multiple_choice',
                        'points': 10,
                        'answers': [
                            ('From any website offering it for free', False, 'Free downloads from random websites often contain malware.'),
                            ('From search engine results', False, 'Search results can lead to malicious sites. Always verify the source.'),
                            ('From the official website or trusted app store', True, 'Correct! Always download from the official source or a verified app store.'),
                            ('From friends or colleagues via email', False, 'Even trusted contacts might unknowingly share malicious files.'),
                        ]
                    },
                ]
            }
        ]

        quiz_count = 0
        for quiz_data in quizzes_data:
            questions_data = quiz_data.pop('questions')
            quiz, created = Quiz.objects.get_or_create(
                title=quiz_data['title'],
                defaults=quiz_data
            )
            if created:
                for i, q_data in enumerate(questions_data, 1):
                    question = Question.objects.create(
                        quiz=quiz,
                        question_text=q_data['text'],
                        question_type=q_data['type'],
                        order=i,
                        points=q_data['points']
                    )
                    for ans_text, is_correct, explanation in q_data['answers']:
                        Answer.objects.create(
                            question=question,
                            answer_text=ans_text,
                            is_correct=is_correct,
                            explanation=explanation
                        )
                quiz_count += 1

        self.stdout.write(self.style.SUCCESS(f'    [OK] {quiz_count} quizzes with questions and answers created'))

    # ─────────────────────────────────────────────
    def _create_achievements(self):
        self.stdout.write('  Creating achievements...')
        achievements = [
            {'name': 'First Steps', 'icon': '👣', 'points_required': 10, 'badge_color': '#95a5a6',
             'description': 'Earn your first 10 points by exploring the platform.'},
            {'name': 'Password Padawan', 'icon': '🔑', 'points_required': 50, 'badge_color': '#3498db',
             'description': 'Earn 50 points mastering password security basics.'},
            {'name': 'Cyber Apprentice', 'icon': '🛡️', 'points_required': 100, 'badge_color': '#2ecc71',
             'description': 'Reach 100 points on your cyber awareness journey.'},
            {'name': 'Quiz Champion', 'icon': '🏆', 'points_required': 200, 'badge_color': '#f39c12',
             'description': 'Earn 200 points by acing multiple quizzes.'},
            {'name': 'Cyber Guardian', 'icon': '⚔️', 'points_required': 500, 'badge_color': '#e74c3c',
             'description': 'Earn 500 points — you are a true cyber defender!'},
            {'name': 'Digital Protector', 'icon': '🌟', 'points_required': 1000, 'badge_color': '#ffd700',
             'description': 'Reach 1000 points — master of cyber awareness!'},
        ]
        count = 0
        for ach_data in achievements:
            _, created = Achievement.objects.get_or_create(name=ach_data['name'], defaults=ach_data)
            if created:
                count += 1
        self.stdout.write(self.style.SUCCESS(f'    [OK] {count} achievements created'))

    # ─────────────────────────────────────────────
    def _create_admin_user(self):
        self.stdout.write('  Creating admin user...')
        if not User.objects.filter(username='admin').exists():
            User.objects.create_superuser(
                username='admin',
                email='admin@cyberawareness.com',
                password='Admin@123',
                first_name='Admin',
                last_name='User',
                role='admin'
            )
            self.stdout.write(self.style.SUCCESS('    [OK] Admin user created (admin / Admin@123)'))
        else:
            self.stdout.write('    -> Admin user already exists, skipping')
