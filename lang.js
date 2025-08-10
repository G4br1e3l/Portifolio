const translations = {
  en: {
    nav_projects: "Projects",
    nav_experience: "Experience",
    nav_lab: "Security Lab",
    nav_contact: "Contact",
    name_puzzle: "Decode the ASCII codes to discover my name: 71 97 98 114 105 101 108 32 72 101 110 114 105 113 117 101",
    hero_role: "Identity & Access Management Security Specialist",
    projects_title: "Security Implementations",
    experience_title: "Professional Journey",
    lab_title: "Practical Experiment of Security Lab",
    lab_description: "Interact with a simulated network and test security rules in real time. Reset the environment anytime.",
    simulate_bruteforce: "Simulate Brute Force",
    simulate_sql: "Simulate SQL Injection",
    simulate_unauth: "Simulate Unauthorized Access",
    reset_lab: "Reset Simulation",
    firewall_status: "Firewall Status",
    firewall_protected: "Protected",
    security_rules: "Security Rules",
    rule_block_ips: "Block Unauthorized IPs",
    rule_sql_injection: "Prevent SQL Injection",
    rule_mfa: "Enable MFA",
    contact_title: "Secure Your Identity and Access",
    contact_text: "Looking for IAM solutions? Let's enhance your security posture.",
    contact_button: "Initialize Contact"
  },
  pt: {
    nav_projects: "Projetos",
    nav_experience: "Experiência",
    nav_lab: "Laboratório",
    nav_contact: "Contato",
    name_puzzle: "Decodifique os códigos ASCII para descobrir meu nome: 71 97 98 114 105 101 108 32 72 101 110 114 105 113 117 101",
    hero_role: "Especialista em Segurança de Identidade e Acesso",
    projects_title: "Implementações de Segurança",
    experience_title: "Jornada Profissional",
    lab_title: "Experimento Prático do Laboratório de Segurança",
    lab_description: "Interaja com uma rede simulada e teste regras de segurança em tempo real. Reinicie o ambiente a qualquer momento.",
    simulate_bruteforce: "Simular Força Bruta",
    simulate_sql: "Simular SQL Injection",
    simulate_unauth: "Simular Acesso Não Autorizado",
    reset_lab: "Reiniciar Simulação",
    firewall_status: "Status do Firewall",
    firewall_protected: "Protegido",
    security_rules: "Regras de Segurança",
    rule_block_ips: "Bloquear IPs Não Autorizados",
    rule_sql_injection: "Prevenir SQL Injection",
    rule_mfa: "Ativar MFA",
    contact_title: "Proteja Sua Identidade e Acesso",
    contact_text: "Procurando soluções IAM? Vamos aprimorar sua postura de segurança.",
    contact_button: "Iniciar Contato"
  }
};

function applyTranslations() {
  const lang = navigator.language && navigator.language.startsWith('pt') ? 'pt' : 'en';
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const translation = translations[lang][key];
    if (translation) {
      el.textContent = translation;
    }
  });
}

document.addEventListener('DOMContentLoaded', applyTranslations);
