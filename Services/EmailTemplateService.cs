using RosraApp.Models.Enums;

namespace RosraApp.Services
{
    public static class EmailTemplateService
    {
        private const string PrimaryColor = "#009EDB"; // UN Blue
        private const string GreenColor = "#10b981";
        private const string RedColor = "#ef4444";
        private const string AmberColor = "#f59e0b";

        // ── Translation dictionary ──
        private static readonly Dictionary<string, Dictionary<string, string>> Translations = new()
        {
            // Layout
            ["layout_subtitle"] = new() { ["en"] = "UN-Habitat Revenue Optimization", ["fr"] = "Optimisation des Revenus UN-Habitat", ["es"] = "Optimizacion de Ingresos UN-Habitat" },
            ["layout_footer"] = new() { ["en"] = "ROSRA | UN-Habitat &mdash; Own Source Revenue Assessment", ["fr"] = "ROSRA | UN-Habitat &mdash; Evaluation des Recettes Propres", ["es"] = "ROSRA | UN-Habitat &mdash; Evaluacion de Ingresos Propios" },
            ["layout_noreply"] = new() { ["en"] = "This is an automated notification. Please do not reply to this email.", ["fr"] = "Ceci est une notification automatique. Veuillez ne pas repondre a cet e-mail.", ["es"] = "Esta es una notificacion automatica. Por favor no responda a este correo." },

            // Common
            ["hi"] = new() { ["en"] = "Hi", ["fr"] = "Bonjour", ["es"] = "Hola" },
            ["report"] = new() { ["en"] = "Report", ["fr"] = "Rapport", ["es"] = "Informe" },
            ["author"] = new() { ["en"] = "Author", ["fr"] = "Auteur", ["es"] = "Autor" },
            ["country"] = new() { ["en"] = "Country", ["fr"] = "Pays", ["es"] = "Pais" },
            ["status_under_review"] = new() { ["en"] = "Status: Under Review", ["fr"] = "Statut : En cours de revision", ["es"] = "Estado: En revision" },
            ["status_validated"] = new() { ["en"] = "Status: Validated", ["fr"] = "Statut : Valide", ["es"] = "Estado: Validado" },

            // Report Submitted
            ["submitted_title"] = new() { ["en"] = "New Assessment Submitted for Review", ["fr"] = "Nouvelle evaluation soumise pour revision", ["es"] = "Nueva evaluacion enviada para revision" },
            ["submitted_body"] = new() { ["en"] = "A new ROSRA assessment has been submitted and is awaiting review.", ["fr"] = "Une nouvelle evaluation ROSRA a ete soumise et attend d'etre revisee.", ["es"] = "Se ha enviado una nueva evaluacion ROSRA y esta en espera de revision." },
            ["submitted_btn"] = new() { ["en"] = "Review Assessment", ["fr"] = "Reviser l'evaluation", ["es"] = "Revisar evaluacion" },
            ["submitted_footer"] = new() { ["en"] = "You are receiving this because you have reviewer permissions in ROSRA.", ["fr"] = "Vous recevez ceci car vous avez des permissions de reviseur dans ROSRA.", ["es"] = "Recibe esto porque tiene permisos de revisor en ROSRA." },

            // Report Claimed
            ["claimed_title"] = new() { ["en"] = "Your Assessment Is Being Reviewed", ["fr"] = "Votre evaluation est en cours de revision", ["es"] = "Su evaluacion esta siendo revisada" },
            ["claimed_body"] = new() { ["en"] = "Your assessment <strong>{0}</strong> has been claimed for review by <strong>{1}</strong>.", ["fr"] = "Votre evaluation <strong>{0}</strong> a ete prise en charge pour revision par <strong>{1}</strong>.", ["es"] = "Su evaluacion <strong>{0}</strong> ha sido tomada para revision por <strong>{1}</strong>." },
            ["claimed_footer"] = new() { ["en"] = "You will be notified when the review is complete.", ["fr"] = "Vous serez notifie lorsque la revision sera terminee.", ["es"] = "Se le notificara cuando se complete la revision." },

            // Report Validated
            ["validated_title"] = new() { ["en"] = "Assessment Validated Successfully", ["fr"] = "Evaluation validee avec succes", ["es"] = "Evaluacion validada exitosamente" },
            ["validated_body"] = new() { ["en"] = "Great news! Your assessment <strong>{0}</strong> has been reviewed and <strong>validated</strong>.", ["fr"] = "Bonne nouvelle ! Votre evaluation <strong>{0}</strong> a ete revisee et <strong>validee</strong>.", ["es"] = "Buenas noticias! Su evaluacion <strong>{0}</strong> ha sido revisada y <strong>validada</strong>." },
            ["validated_btn"] = new() { ["en"] = "View Report", ["fr"] = "Voir le rapport", ["es"] = "Ver informe" },
            ["validated_footer"] = new() { ["en"] = "Your validated report is now available in the ROSRA Validated Library.", ["fr"] = "Votre rapport valide est maintenant disponible dans la bibliotheque validee ROSRA.", ["es"] = "Su informe validado ya esta disponible en la Biblioteca Validada de ROSRA." },

            // Report Rejected
            ["rejected_title"] = new() { ["en"] = "Assessment Needs Revision", ["fr"] = "L'evaluation necessite une revision", ["es"] = "La evaluacion necesita revision" },
            ["rejected_body"] = new() { ["en"] = "Your assessment <strong>{0}</strong> has been reviewed and requires some revisions before it can be validated.", ["fr"] = "Votre evaluation <strong>{0}</strong> a ete revisee et necessite des modifications avant de pouvoir etre validee.", ["es"] = "Su evaluacion <strong>{0}</strong> ha sido revisada y requiere algunas revisiones antes de poder ser validada." },
            ["rejected_reason_label"] = new() { ["en"] = "Revision Reason", ["fr"] = "Motif de revision", ["es"] = "Motivo de revision" },
            ["rejected_btn"] = new() { ["en"] = "Edit & Resubmit", ["fr"] = "Modifier et resoumettre", ["es"] = "Editar y reenviar" },
            ["rejected_footer"] = new() { ["en"] = "Please address the feedback and resubmit when ready.", ["fr"] = "Veuillez prendre en compte les commentaires et resoumettre lorsque vous etes pret.", ["es"] = "Por favor atienda los comentarios y reenvie cuando este listo." },

            // Report Unlocked
            ["unlocked_title"] = new() { ["en"] = "Validated Assessment Unlocked", ["fr"] = "Evaluation validee deverrouillee", ["es"] = "Evaluacion validada desbloqueada" },
            ["unlocked_body"] = new() { ["en"] = "A previously validated assessment <strong>{0}</strong> has been unlocked by an administrator for further revision.", ["fr"] = "Une evaluation precedemment validee <strong>{0}</strong> a ete deverrouillee par un administrateur pour revision supplementaire.", ["es"] = "Una evaluacion previamente validada <strong>{0}</strong> ha sido desbloqueada por un administrador para revision adicional." },
            ["unlocked_reason_label"] = new() { ["en"] = "Reason for Unlock", ["fr"] = "Motif du deverrouillage", ["es"] = "Motivo del desbloqueo" },
            ["unlocked_footer"] = new() { ["en"] = "Please review and resubmit the assessment when revisions are complete.", ["fr"] = "Veuillez revoir et resoumettre l'evaluation une fois les modifications terminees.", ["es"] = "Por favor revise y reenvie la evaluacion cuando las revisiones esten completas." },

            // Welcome
            ["welcome_title"] = new() { ["en"] = "Welcome to ROSRA", ["fr"] = "Bienvenue sur ROSRA", ["es"] = "Bienvenido a ROSRA" },
            ["welcome_body1"] = new() { ["en"] = "Welcome to <strong>ROSRA</strong> — the Revenue Optimization for Subnational Revenue Assessment tool by UN-Habitat.", ["fr"] = "Bienvenue sur <strong>ROSRA</strong> — l'outil d'Optimisation des Revenus pour l'Evaluation des Recettes Infranationales d'UN-Habitat.", ["es"] = "Bienvenido a <strong>ROSRA</strong> — la herramienta de Optimizacion de Ingresos para la Evaluacion de Ingresos Subnacionales de UN-Habitat." },
            ["welcome_body2"] = new() { ["en"] = "You can now create revenue assessments, analyze own-source revenue gaps, and submit reports for review.", ["fr"] = "Vous pouvez maintenant creer des evaluations de revenus, analyser les ecarts de recettes propres et soumettre des rapports pour revision.", ["es"] = "Ahora puede crear evaluaciones de ingresos, analizar brechas de ingresos propios y enviar informes para revision." },
            ["welcome_btn"] = new() { ["en"] = "Get Started", ["fr"] = "Commencer", ["es"] = "Comenzar" },
            ["welcome_footer"] = new() { ["en"] = "If you didn't create this account, please ignore this email.", ["fr"] = "Si vous n'avez pas cree ce compte, veuillez ignorer cet e-mail.", ["es"] = "Si no creo esta cuenta, por favor ignore este correo." },

            // Test
            ["test_title"] = new() { ["en"] = "ROSRA Email Test", ["fr"] = "Test d'e-mail ROSRA", ["es"] = "Prueba de correo ROSRA" },
            ["test_body"] = new() { ["en"] = "This is a test email from the ROSRA notification system. If you're reading this, email delivery is working correctly.", ["fr"] = "Ceci est un e-mail de test du systeme de notification ROSRA. Si vous lisez ceci, la livraison des e-mails fonctionne correctement.", ["es"] = "Este es un correo de prueba del sistema de notificaciones ROSRA. Si esta leyendo esto, la entrega de correos funciona correctamente." },
            ["test_verified"] = new() { ["en"] = "Email Configuration Verified", ["fr"] = "Configuration e-mail verifiee", ["es"] = "Configuracion de correo verificada" },
        };

        private static string T(string key, string culture = "en")
        {
            var lang = (culture ?? "en").ToLower();
            if (lang.Length > 2) lang = lang[..2]; // "fr-FR" → "fr"
            if (Translations.TryGetValue(key, out var dict))
                return dict.TryGetValue(lang, out var val) ? val : dict.GetValueOrDefault("en", key);
            return key;
        }

        private static string WrapInLayout(string title, string preheader, string bodyContent, string culture = "en")
        {
            return $@"
<!DOCTYPE html>
<html>
<head><meta charset=""utf-8""><meta name=""viewport"" content=""width=device-width,initial-scale=1""></head>
<body style=""margin:0;padding:0;background:#f4f5f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;"">
<div style=""display:none;max-height:0;overflow:hidden;"">{preheader}</div>
<table width=""100%"" cellpadding=""0"" cellspacing=""0"" style=""background:#f4f5f7;padding:32px 16px;"">
<tr><td align=""center"">
<table width=""600"" cellpadding=""0"" cellspacing=""0"" style=""background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);"">
  <tr><td style=""background:{PrimaryColor};padding:28px 32px;text-align:center;"">
    <div style=""font-size:24px;font-weight:700;color:#ffffff;letter-spacing:0.5px;"">ROSRA</div>
    <div style=""font-size:11px;color:rgba(255,255,255,0.8);margin-top:4px;letter-spacing:1px;text-transform:uppercase;"">{T("layout_subtitle", culture)}</div>
  </td></tr>
  <tr><td style=""background:#f8fafc;padding:16px 32px;border-bottom:1px solid #e5e7eb;"">
    <div style=""font-size:16px;font-weight:600;color:#222;"">{title}</div>
  </td></tr>
  <tr><td style=""padding:28px 32px;"">
    {bodyContent}
  </td></tr>
  <tr><td style=""background:#f8fafc;padding:20px 32px;border-top:1px solid #e5e7eb;text-align:center;"">
    <div style=""font-size:11px;color:#9ca3af;"">
      {T("layout_footer", culture)}<br>
      {T("layout_noreply", culture)}
    </div>
  </td></tr>
</table>
</td></tr>
</table>
</body>
</html>";
        }

        private static string Button(string text, string url, string color = "#009EDB")
        {
            return $@"<table cellpadding=""0"" cellspacing=""0"" style=""margin:20px 0;""><tr><td>
<a href=""{url}"" style=""display:inline-block;padding:12px 28px;background:{color};color:#ffffff;text-decoration:none;border-radius:8px;font-weight:600;font-size:14px;"">{text}</a>
</td></tr></table>";
        }

        private static string InfoRow(string label, string value)
        {
            return $@"<tr><td style=""padding:6px 0;color:#6b7280;font-size:13px;width:140px;vertical-align:top;"">{label}</td><td style=""padding:6px 0;color:#222;font-size:13px;font-weight:500;"">{value}</td></tr>";
        }

        private static string P(string text) =>
            $@"<p style=""color:#374151;font-size:14px;line-height:1.6;margin:0 0 16px;"">{text}</p>";

        // ═══════════════════════════════════════════════════
        //  PUBLIC TEMPLATE METHODS
        // ═══════════════════════════════════════════════════

        public static string ReportSubmitted(string reviewerName, string authorName, string reportTitle, string country, string reportUrl, string culture = "en")
        {
            return WrapInLayout(T("submitted_title", culture), $"{authorName} - {reportTitle}", $@"
{P($"{T("hi", culture)} {reviewerName},")}
{P(T("submitted_body", culture))}
<table cellpadding=""0"" cellspacing=""0"" style=""width:100%;background:#f0f9ff;border-radius:8px;padding:16px;margin-bottom:20px;"">
  {InfoRow(T("report", culture), reportTitle)}
  {InfoRow(T("author", culture), authorName)}
  {InfoRow(T("country", culture), country)}
</table>
{Button(T("submitted_btn", culture), reportUrl)}
<p style=""color:#9ca3af;font-size:12px;margin-top:16px;"">{T("submitted_footer", culture)}</p>", culture);
        }

        public static string ReportClaimed(string userName, string reportTitle, string reviewerName, string culture = "en")
        {
            return WrapInLayout(T("claimed_title", culture), $"{reviewerName} - {reportTitle}", $@"
{P($"{T("hi", culture)} {userName},")}
{P(string.Format(T("claimed_body", culture), reportTitle, reviewerName))}
<div style=""background:#dbeafe;border-radius:8px;padding:16px;text-align:center;margin:20px 0;"">
  <div style=""font-size:14px;color:#1e40af;font-weight:600;"">{T("status_under_review", culture)}</div>
</div>
<p style=""color:#6b7280;font-size:13px;"">{T("claimed_footer", culture)}</p>", culture);
        }

        public static string ReportValidated(string userName, string reportTitle, string reportUrl, string culture = "en")
        {
            return WrapInLayout(T("validated_title", culture), reportTitle, $@"
{P($"{T("hi", culture)} {userName},")}
{P(string.Format(T("validated_body", culture), reportTitle))}
<div style=""background:#d1fae5;border-radius:8px;padding:16px;text-align:center;margin:20px 0;"">
  <div style=""font-size:14px;color:#065f46;font-weight:600;"">{T("status_validated", culture)}</div>
</div>
{Button(T("validated_btn", culture), reportUrl, GreenColor)}
<p style=""color:#6b7280;font-size:13px;"">{T("validated_footer", culture)}</p>", culture);
        }

        public static string ReportRejected(string userName, string reportTitle, string reason, string reportUrl, string culture = "en")
        {
            return WrapInLayout(T("rejected_title", culture), reportTitle, $@"
{P($"{T("hi", culture)} {userName},")}
{P(string.Format(T("rejected_body", culture), reportTitle))}
<div style=""background:#fef2f2;border-radius:8px;padding:16px;margin:20px 0;"">
  <div style=""font-size:12px;font-weight:600;color:#991b1b;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px;"">{T("rejected_reason_label", culture)}</div>
  <div style=""font-size:14px;color:#374151;line-height:1.5;"">{reason}</div>
</div>
{Button(T("rejected_btn", culture), reportUrl, AmberColor)}
<p style=""color:#6b7280;font-size:13px;"">{T("rejected_footer", culture)}</p>", culture);
        }

        public static string ReportUnlocked(string userName, string reportTitle, string reason, string culture = "en")
        {
            return WrapInLayout(T("unlocked_title", culture), reportTitle, $@"
{P($"{T("hi", culture)} {userName},")}
{P(string.Format(T("unlocked_body", culture), reportTitle))}
<div style=""background:#fef3c7;border-radius:8px;padding:16px;margin:20px 0;"">
  <div style=""font-size:12px;font-weight:600;color:#92400e;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px;"">{T("unlocked_reason_label", culture)}</div>
  <div style=""font-size:14px;color:#374151;line-height:1.5;"">{reason}</div>
</div>
<p style=""color:#6b7280;font-size:13px;"">{T("unlocked_footer", culture)}</p>", culture);
        }

        public static string WelcomeEmail(string userName, string loginUrl, string culture = "en")
        {
            return WrapInLayout(T("welcome_title", culture), $"{userName} - ROSRA", $@"
{P($"{T("hi", culture)} {userName},")}
{P(T("welcome_body1", culture))}
{P(T("welcome_body2", culture))}
{Button(T("welcome_btn", culture), loginUrl)}
<p style=""color:#6b7280;font-size:13px;"">{T("welcome_footer", culture)}</p>", culture);
        }

        public static string TestEmail(string adminName, string culture = "en")
        {
            return WrapInLayout(T("test_title", culture), "ROSRA Test", $@"
{P($"{T("hi", culture)} {adminName},")}
{P(T("test_body", culture))}
<div style=""background:#d1fae5;border-radius:8px;padding:16px;text-align:center;margin:20px 0;"">
  <div style=""font-size:14px;color:#065f46;font-weight:600;"">{T("test_verified", culture)}</div>
</div>
<p style=""color:#6b7280;font-size:13px;"">Sent at: {DateTime.UtcNow:yyyy-MM-dd HH:mm:ss} UTC</p>", culture);
        }

        public static Dictionary<string, string> GetAllTemplatePreviews(string culture = "en")
        {
            return new Dictionary<string, string>
            {
                [T("submitted_title", culture)] = ReportSubmitted("Reviewer", "John Doe", "ROSRA Report - Kenya - Nakuru", "Kenya", "#", culture),
                [T("claimed_title", culture)] = ReportClaimed("John Doe", "ROSRA Report - Kenya - Nakuru", "Jane Smith", culture),
                [T("validated_title", culture)] = ReportValidated("John Doe", "ROSRA Report - Kenya - Nakuru", "#", culture),
                [T("rejected_title", culture)] = ReportRejected("John Doe", "ROSRA Report - Kenya - Nakuru", "The property tax data needs to be updated with 2024 figures.", "#", culture),
                [T("unlocked_title", culture)] = ReportUnlocked("John Doe", "ROSRA Report - Kenya - Nakuru", "New fiscal year data available.", culture),
                [T("welcome_title", culture)] = WelcomeEmail("John Doe", "#", culture),
                [T("test_title", culture)] = TestEmail("Admin", culture),
            };
        }
    }
}
