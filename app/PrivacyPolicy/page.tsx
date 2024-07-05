import EmptyState from "@/app/components/EmptyState";
import ClientOnly from "@/app/components/ClientOnly";

const PrivacyPolicy = () => {
  const deleteEmail = "mnq_11@yahoo.com";
  const deleteRequestDuration = "48 ساعة";

  return (
      <ClientOnly>
        <div className="max-w-3xl mx-auto p-8 bg-white rounded-lg shadow-md mt-8 text-right">
          <h1 className="text-3xl font-bold mb-6 text-center">سياسة الخصوصية</h1>

          <h2 className="text-2xl font-semibold mb-4">١. أنواع المعلومات</h2>
          <p className="mb-4">قد نجمع الأنواع التالية من المعلومات الشخصية:</p>
          <ul className="list-disc list-inside mb-6 space-y-2">
            <li className="rtl">عنوان البريد الإلكتروني: نقوم بجمع عنوان بريدك الإلكتروني لغرض التواصل وإدارة الحساب.</li>
            <li className="rtl">كلمة المرور: نقوم بتخزين كلمة المرور الخاصة بك بأمان لمصادقة حسابك.</li>
            <li className="rtl">المنشورات: إذا قمت بإنشاء منشورات على منصتنا، فقد نجمع ونخزن محتوى تلك المنشورات.</li>
          </ul>

          <h2 className="text-2xl font-semibold mb-4">٢. استخدام ومشاركة البيانات</h2>
          <p className="mb-4">نستخدم المعلومات المجمعة للأغراض التالية:</p>
          <ul className="list-disc list-inside mb-6 space-y-2">
            <li className="rtl">عنوان البريد الإلكتروني: نستخدم عنوان بريدك الإلكتروني لإرسال الإشعارات والتحديثات المهمة المتعلقة بحسابك.</li>
            <li className="rtl">كلمة المرور: يتم تخزين كلمة مرورك بشكل آمن ومشفّر لحماية سلامة حسابك.</li>
            <li className="rtl">المنشورات: يتم تخزين محتوى منشوراتك وعرضها علنًا على منصتنا حسب استخدامك المقصود.</li>
          </ul>

          <h2 className="text-2xl font-semibold mb-4">٣. أمن البيانات</h2>
          <p className="mb-6 rtl">
            نتخذ التدابير المناسبة لضمان أمان معلوماتك الشخصية. يتضمن ذلك تنفيذ ضوابط صارمة للوصول، والتشفير، والتدقيقات الأمنية الدورية.
          </p>

          <h2 className="text-2xl font-semibold mb-4">٤. الاحتفاظ بالبيانات والحذف</h2>
          <p className="mb-4 rtl">
            نحتفظ بمعلوماتك الشخصية طالما كان ذلك ضروريًا لتحقيق الأغراض الموضحة في سياسة الخصوصية هذه. إذا كنت ترغب في حذف حسابك والبيانات المرتبطة به، يرجى الاتصال بفريق الدعم لدينا على <a href={`mailto:${deleteEmail}`} className="text-blue-500 underline">{deleteEmail}</a> وستتم معالجة طلبك في غضون {deleteRequestDuration}.
          </p>

          <p className="mt-6 rtl">
            يرجى ملاحظة أن هذا نظرة عامة عامة على سياسة الخصوصية الخاصة بنا. للحصول على معلومات أكثر تفصيلًا وفهم حقوقك واختياراتك بشأن معلوماتك الشخصية، يرجى الرجوع إلى سياسة الخصوصية الكاملة المتاحة على موقعنا الإلكتروني.
          </p>
        </div>
      </ClientOnly>
  );
};

export default PrivacyPolicy;
