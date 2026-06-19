export interface Chapter {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  objectivesAr: string[];
  objectivesEn: string[];
  activitiesAr: string[];
  activitiesEn: string[];
  standardAr: string;
  standardEn: string;
}

export interface SubjectCurriculum {
  subjectAr: string;
  subjectEn: string;
  chapters: Chapter[];
}

export const CURRICULUM_DATA: Record<string, SubjectCurriculum[]> = {
  'الاول': [
    {
      subjectAr: 'الرياضيات',
      subjectEn: 'Mathematics',
      chapters: [
        {
          id: 'gr1-math-ch1',
          titleAr: 'الفصل الأول: الأعداد والعد حتى 10',
          titleEn: 'Chapter 1: Numbers & Counting to 10',
          descriptionAr: 'التعرف على الأعداد من 1 إلى 10، وكيفية عد المجموعات وكتابة الأرقام.',
          descriptionEn: 'Introduction to numbers 1 to 10, counting groups of items, and writing digits.',
          objectivesAr: ['أن يعد الطالب الأشياء حتى 10.', 'أن يكتب الأرقام من 1 إلى 10 بشكل صحيح.', 'أن يقارن بين المجموعات من حيث الأكثر والأقل.'],
          objectivesEn: ['Count objects up to 10.', 'Write numbers 1 to 10 correctly.', 'Compare groups by quantity (more/less).'],
          activitiesAr: ['استخدام المكعبات التعليمية لعد الأشكال.', 'كتابة الأرقام بالرمل أو التلوين.', 'ألعاب فرز المجموعات.'],
          activitiesEn: ['Using educational blocks to count shapes.', 'Writing numbers in sand or coloring.', 'Group sorting games.'],
          standardAr: 'معيار الأعداد والعمليات 1.1 - فهم نظام الأعداد الصحيحة',
          standardEn: 'Standard Number & Operations 1.1 - Understanding the Whole Number System'
        },
        {
          id: 'gr1-math-ch2',
          titleAr: 'الفصل الثاني: الجمع البسيط',
          titleEn: 'Chapter 2: Simple Addition',
          descriptionAr: 'مفهوم الجمع كضم مجموعتين وحساب الناتج الإجمالي حتى 10.',
          descriptionEn: 'Concept of addition as joining two groups together and finding total sum up to 10.',
          objectivesAr: ['أن يستوعب الطالب مفهوم الإشارة (+).', 'أن يجمع عددين ناتجهما لا يتجاوز 10.', 'أن يحل مسائل لفظية بسيطة عن الجمع.'],
          objectivesEn: ['Understand the plus (+) symbol.', 'Add two numbers with sums up to 10.', 'Solve simple word problems on addition.'],
          activitiesAr: ['تمثيل الجمع بالصور والتفاح.', 'استخدام أصابع اليدين لحساب ناتج الجمع.', 'حل بطاقات تفاعلية بالضم.'],
          activitiesEn: ['Representing addition with pictures and apples.', 'Using fingers to calculate sums.', 'Solving interactive joining cards.'],
          standardAr: 'معيار العمليات الحسابية 1.2 - العمليات الأساسية للجمع',
          standardEn: 'Standard Operations 1.2 - Basic Operations of Addition'
        }
      ]
    },
    {
      subjectAr: 'اللغة العربية',
      subjectEn: 'Arabic Language',
      chapters: [
        {
          id: 'gr1-ar-ch1',
          titleAr: 'الفصل الأول: حروف الهجاء ومخارجها',
          titleEn: 'Chapter 1: Arabic Alphabet & Pronunciation',
          descriptionAr: 'التعرف على أشكال حروف الهجاء ونطقها بالحركات القصيرة (الفتحة، الضمة، الكسرة).',
          descriptionEn: 'Learning the letters of the Arabic alphabet and their pronunciation with short vowels.',
          objectivesAr: ['أن ينطق الطالب الحروف الهجائية نطقاً سليماً.', 'أن يميز شكل الحرف في أول ووسط وآخر الكلمة.', 'أن يقرأ كلمات ثلاثية بسيطة بالفتح.'],
          objectivesEn: ['Pronounce alphabet letters correctly.', 'Distinguish letter shapes at the beginning, middle, and end of a word.', 'Read simple three-letter words with Fatha.'],
          activitiesAr: ['أغنية حروف الهجاء.', 'توصيل الحرف بالصورة المناسبة له.', 'كتابة الحروف وتلوينها.'],
          activitiesEn: ['Alphabet song.', 'Matching letters to the correct pictures.', 'Writing and coloring letters.'],
          standardAr: 'معيار القراءة والكتابة المبكرة 1.1 - الوعي الفونيمي والأشكال الحرفية',
          standardEn: 'Standard Early Literacy 1.1 - Phonemic Awareness & Letter Shapes'
        }
      ]
    }
  ],
  'الرابع': [
    {
      subjectAr: 'الرياضيات',
      subjectEn: 'Mathematics',
      chapters: [
        {
          id: 'gr4-math-ch1',
          titleAr: 'الفصل الأول: الكسور العشرية',
          titleEn: 'Chapter 1: Decimal Fractions',
          descriptionAr: 'التعرف على الأجزاء من عشرة والأجزاء من مئة وقراءتها وتمثيلها خطياً.',
          descriptionEn: 'Understanding tenths and hundredths, reading decimals, and representing them on a number line.',
          objectivesAr: ['أن يكتب الطالب الكسور الاعتيادية على صورة كسور عشرية.', 'أن يقارن الطالب بين الكسر العشري والاعتيادي.', 'أن يمثل الكسر العشري على خط الأعداد.'],
          objectivesEn: ['Write common fractions as decimals.', 'Compare decimals and common fractions.', 'Represent decimals on a number line.'],
          activitiesAr: ['استخدام النماذج الملونة المقسمة لعشرة ومئة جزء.', 'مسابقات قراءة الأسعار ومقارنة الأعداد العشرية.', 'ألعاب المطابقة الكسرية.'],
          activitiesEn: ['Using colored grids divided into 10 and 100 parts.', 'Price tag reading games and comparing decimals.', 'Fraction matching cards.'],
          standardAr: 'معيار الأعداد والعمليات 4.1 - الكسور والنسب العشرية',
          standardEn: 'Standard Numbers 4.1 - Fractions & Decimals'
        },
        {
          id: 'gr4-math-ch2',
          titleAr: 'الفصل الثاني: الهندسة والزوايا',
          titleEn: 'Chapter 2: Geometry & Angles',
          descriptionAr: 'أنواع الزوايا (قائمة، حادة، منفرجة) وكيفية قياسها باستخدام المنقلة وتسمية المضلعات.',
          descriptionEn: 'Types of angles (right, acute, obtuse), measuring them using a protractor, and naming polygons.',
          objectivesAr: ['أن يصنف الطالب الزوايا حسب قياسها.', 'أن يقيس الزاوية بالمنقلة بدقة.', 'أن يتعرف على خصائص المربع والمستطيل.'],
          objectivesEn: ['Classify angles by their measure.', 'Measure angles accurately using a protractor.', 'Recognize properties of squares and rectangles.'],
          activitiesAr: ['البحث عن الزوايا في الغرفة الصفية.', 'رسم أشكال هندسية باستخدام المسطرة والمنقلة.', 'صناعة طائرة ورقية وحساب زواياها.'],
          activitiesEn: ['Finding angles in the classroom.', 'Drawing geometric shapes with ruler and protractor.', 'Making paper planes and measuring their angles.'],
          standardAr: 'معيار القياس والهندسة 4.2 - قياس الزوايا والمضلعات ثنائية الأبعاد',
          standardEn: 'Standard Geometry & Measurement 4.2 - Measuring Angles and 2D Polygons'
        }
      ]
    },
    {
      subjectAr: 'العلوم الطبيعية',
      subjectEn: 'Natural Sciences',
      chapters: [
        {
          id: 'gr4-sci-ch1',
          titleAr: 'الفصل الأول: حالات المادة وخصائصها',
          titleEn: 'Chapter 1: States of Matter & Properties',
          descriptionAr: 'دراسة الحالات الثلاث للمادة (الصلبة، السائلة، الغازية) والتحولات بينها بفعل الحرارة.',
          descriptionEn: 'Study of the three states of matter (solid, liquid, gas) and phase transitions due to temperature.',
          objectivesAr: ['أن يعدد الطالب الحالات الثلاث للمادة.', 'أن يشرح خصائص الجزيئات في كل حالة بالرسم.', 'أن يربط بين ارتفاع درجة الحرارة والانصهار والتبخر.'],
          objectivesEn: ['List the three states of matter.', 'Explain particle arrangement in each state through drawing.', 'Relate temperature increase to melting and evaporation.'],
          activitiesAr: ['تجربة عملية لصهر الجليد وتبخير الماء.', 'ملاحظة تمدد البالون بالغاز والضغط.', 'تطبيق تصنيف المواد اليومية.'],
          activitiesEn: ['Practical experiment of ice melting and water vaporizing.', 'Observing balloon expansion under gas pressure.', 'Sorting everyday substances.'],
          standardAr: 'معيار المادة والطاقة 4.3 - التحولات الفيزيائية والخصائص المادية',
          standardEn: 'Standard Matter & Energy 4.3 - Physical Changes & Matter Properties'
        }
      ]
    }
  ],
  'التاسع': [
    {
      subjectAr: 'الرياضيات',
      subjectEn: 'Mathematics',
      chapters: [
        {
          id: 'gr9-math-ch1',
          titleAr: 'الفصل الأول: الجمل والمتباينات الخطية',
          titleEn: 'Chapter 1: Linear Equations & Inequalities',
          descriptionAr: 'حل متباينات الدرجة الأولى بيانياً وجبرياً وتطبيقها على مسائل حياتية.',
          descriptionEn: 'Solving first-degree inequalities graphically and algebraically, applying them to real-life scenarios.',
          objectivesAr: ['أن يحل الطالب نظاماً من متباينتين خطيتين.', 'أن يمثل منطقة الحل البياني على المستوى الإحداثي.', 'أن يصيغ متباينات تعبر عن قيود مادية ملموسة.'],
          objectivesEn: ['Solve a system of two linear inequalities.', 'Graph the solution region on a coordinate plane.', 'Formulate inequalities representing real constraints.'],
          activitiesAr: ['رسم متباينات على لوحات ورقية ملونة.', 'حل متباينات تفاعلية عبر برامج الرسم البياني.', 'مشروع تصميم سياج حديقة مقيد بميزانية.'],
          activitiesEn: ['Drawing inequalities on colored poster boards.', 'Solving interactive inequalities using graphing software.', 'Budget-constrained garden fencing project.'],
          standardAr: 'معيار الجبر والدوال 9.1 - المتباينات والتمثيل البياني',
          standardEn: 'Standard Algebra & Functions 9.1 - Inequalities & Graphing'
        }
      ]
    }
  ],
  'العاشر': [
    {
      subjectAr: 'الفيزياء',
      subjectEn: 'Physics',
      chapters: [
        {
          id: 'gr10-phy-ch1',
          titleAr: 'الفصل الأول: علم الحركة في بعد واحد',
          titleEn: 'Chapter 1: 1D Kinematics',
          descriptionAr: 'دراسة الحركة، الإزاحة، السرعة، والتسارع الثابت ومعادلات الحركة المستقيمة.',
          descriptionEn: 'Study of motion, displacement, velocity, constant acceleration, and equations of rectilinear motion.',
          objectivesAr: ['أن يميز الطالب بين الكميات القياسية والكميات المتجهة.', 'أن يطبق معادلات الحركة الأربعة لحساب الإزاحة والتسارع.', 'أن يرسم المنحنيات البيانية للموقع والسرعة بالنسبة للزمن.'],
          objectivesEn: ['Distinguish between scalar and vector quantities.', 'Apply the four equations of motion to calculate displacement and acceleration.', 'Draw position-time and velocity-time graphs.'],
          activitiesAr: ['تجربة إسقاط كرات مختلفة وحساب تسارع الجاذبية.', 'تحليل حركة مركبات حقيقية باستخدام حساسات سرعة.', 'حل مسائل تطبيقية حول المقذوفات في خط مستقيم.'],
          activitiesEn: ['Dropping different spheres to calculate gravitational acceleration.', 'Analyzing vehicle motion using velocity sensors.', 'Solving applied problems on linear motion.'],
          standardAr: 'معيار الفيزياء الميكانيكية 10.1 - علم الحركة والقوانين الأساسية',
          standardEn: 'Standard Mechanics 10.1 - Kinematics and Basic Laws'
        },
        {
          id: 'gr10-phy-ch2',
          titleAr: 'الفصل الثاني: قوانين نيوتن للحركة',
          titleEn: 'Chapter 2: Newtons Laws of Motion',
          descriptionAr: 'مفهوم القوة والقصور الذاتي، والقوانين الثلاث للحركة وتطبيقات الاحتكاك والاتزان.',
          descriptionEn: 'Concept of force, inertia, Newtons three laws of motion, friction applications, and equilibrium.',
          objectivesAr: ['أن يشرح الطالب قانون نيوتن الأول والقصور الذاتي للدرجات الهوائية.', 'أن يحسب القوة المحصلة باستخدام F=ma في مستويات مائلة.', 'أن يحدد قوى الفعل ورد الفعل للأجسام المتصادمة.'],
          objectivesEn: ['Explain Newtons First Law and inertia in vehicles.', 'Calculate net force using F=ma on inclined planes.', 'Identify action and reaction forces for colliding objects.'],
          activitiesAr: ['تجربة تحريك عربات بأثقال مختلفة وقياس التسارع.', 'دراسة معاملات الاحتكاك لمواد مختلفة بالصف.', 'رسم مخططات القوى الحرة للأجسام المتزنة.'],
          activitiesEn: ['Moving carts with various weights and measuring acceleration.', 'Studying friction coefficients of materials in the classroom.', 'Drawing free-body diagrams for balanced objects.'],
          standardAr: 'معيار الميكانيكا والديناميكا 10.2 - القوى وعلم الحركة والنيوتنية',
          standardEn: 'Standard Mechanics & Dynamics 10.2 - Force, Motion, & Newtonian Dynamics'
        }
      ]
    },
    {
      subjectAr: 'اللغة الإنجليزية',
      subjectEn: 'English Language',
      chapters: [
        {
          id: 'gr10-en-ch1',
          titleAr: 'الفصل الأول: القراءة النقدية وكتابة المقالات',
          titleEn: 'Chapter 1: Critical Reading & Essay Writing',
          descriptionAr: 'تحليل نصوص معقدة واستخراج الأطروحة وبناء مقال إقناعي ذو بنية متينة.',
          descriptionEn: 'Analyzing complex texts, identifying the thesis statement, and constructing a well-structured persuasive essay.',
          objectivesAr: ['أن يحلل الطالب نصاً أدبياً ويحدد النغمة والأسلوب.', 'أن يكتب مقدمة مقال تحتوي على أطروحة واضحة.', 'أن يربط بين الفقرات باستخدام كلمات ربط مناسبة.'],
          objectivesEn: ['Analyze a literary text and identify tone and style.', 'Write an essay introduction containing a clear thesis statement.', 'Link paragraphs using appropriate transition words.'],
          activitiesAr: ['مناظرة صفية حول قضايا عامة ثم صياغتها كمقال.', 'تحليل مقالات صحفية واستخراج الحجج الداعمة.', 'ورش عمل لمراجعة المقالات وتصحيحها ثنائياً.'],
          activitiesEn: ['Classroom debate on general issues followed by essay writing.', 'Analyzing newspaper columns and extracting supporting arguments.', 'Peer-review workshops for essay editing.'],
          standardAr: 'معيار اللغة الإنجليزية للصف العاشر 10.1 - الكتابة الأكاديمية والقراءة التحليلية',
          standardEn: 'Standard Grade 10 English 10.1 - Academic Writing & Analytical Reading'
        }
      ]
    }
  ],
  'الحادي عشر': [
    {
      subjectAr: 'الرياضيات التطبيقية',
      subjectEn: 'Applied Mathematics',
      chapters: [
        {
          id: 'gr11-math-ch1',
          titleAr: 'الفصل الأول: حساب المثلثات والدوال الدائرية',
          titleEn: 'Chapter 1: Trigonometry & Circular Functions',
          descriptionAr: 'دراسة المتطابقات المثلثية والنسب المثلثية للزوايا، ودراسة تمثيل المنحنيات الجيبية وجيب التمام.',
          descriptionEn: 'Study of trigonometric identities and ratios, graphing sine and cosine curves, and solving equations.',
          objectivesAr: ['أن يستنتج الطالب المتطابقات المثلثية الأساسية.', 'أن يمثل دالتي الجيب وجيب التمام بيانياً.', 'أن يحل معادلات مثلثية في فترات محددة.'],
          objectivesEn: ['Derive basic trigonometric identities.', 'Graph sine and cosine functions.', 'Solve trigonometric equations in specified intervals.'],
          activitiesAr: ['استخدام أدوات الرسم البياني الرقمية لنمذجة الموجات الجيبية.', 'حساب قياسات زوايا الظل والمنازل القريبة.', 'تصميم لعبة إحداثيات تعتمد على الدوال الدائرية.'],
          activitiesEn: ['Using digital graphing tools to model sine waves.', 'Calculating angle measurements using shadows and local heights.', 'Designing a coordinates game based on circular functions.'],
          standardAr: 'معيار الرياضيات المتقدمة 11.1 - حساب المثلثات وتطبيقاتها الموجية',
          standardEn: 'Standard Advanced Mathematics 11.1 - Trigonometry & Wave Applications'
        }
      ]
    },
    {
      subjectAr: 'الكيمياء',
      subjectEn: 'Chemistry',
      chapters: [
        {
          id: 'gr11-chem-ch1',
          titleAr: 'الفصل الأول: الروابط الكيميائية والشكل الهندسي للجزيء',
          titleEn: 'Chapter 1: Chemical Bonding & Molecular Geometry',
          descriptionAr: 'تفسير نشوء الروابط الأيونية والتساهمية ونظريات التهجين وتحديد زوايا وأشكال المركبات الكيميائية.',
          descriptionEn: 'Explaining ionic and covalent bonding, hybridization theories, and determining angles and shapes of chemical compounds.',
          objectivesAr: ['أن يرسم الطالب تراكيب لويس للمركبات التساهمية.', 'أن يحدد نوع التهجين للذرة المركزية (sp, sp2, sp3).', 'أن يتوقع الشكل الهندسي للجزيء بناءً على نظرية تنافر أزواج الإلكترونات.'],
          objectivesEn: ['Draw Lewis structures for covalent compounds.', 'Determine hybridization of the central atom (sp, sp2, sp3).', 'Predict molecular geometry based on VSEPR theory.'],
          activitiesAr: ['بناء مجسمات ثلاثية الأبعاد للجزيئات باستخدام معجون الأسنان والأعواد.', 'تطبيقات الكيمياء الحاسوبية لمحاكاة استقطاب الجزيء.', 'مسابقة تصنيف الروابط للمواد الشائعة.'],
          activitiesEn: ['Building 3D molecular models using clay and toothpicks.', 'Computational chemistry applications simulating molecular polarity.', 'Bond classification quiz for common substances.'],
          standardAr: 'معيار الكيمياء العضوية وغير العضوية 11.1 - بناء المادة والروابط الكيميائية',
          standardEn: 'Standard Organic & Inorganic Chemistry 11.1 - Matter Structure & Chemical Bonding'
        }
      ]
    }
  ],
  'الثاني عشر': [
    {
      subjectAr: 'الرياضيات البحته',
      subjectEn: 'Pure Mathematics',
      chapters: [
        {
          id: 'gr12-math-ch1',
          titleAr: 'الفصل الأول: التفاضل وتطبيقاته',
          titleEn: 'Chapter 1: Differentiation & Applications',
          descriptionAr: 'مفهوم النهاية والاتصال، قواعد الاشتقاق الأساسية، وتطبيقات القيم العظمى والصغرى ومعدلات التغير المرتبطة.',
          descriptionEn: 'Concept of limits and continuity, basic rules of differentiation, extreme values, and related rates of change.',
          objectivesAr: ['أن يحسب الطالب المشتقة الأولى للدوال المركبة والدائرية.', 'أن يحدد فترات التزايد والتناقص ونقاط الانعطاف للدالة.', 'أن يحل مسائل المثالية (Optimization) لحساب الحجم والمساحة القصوى.'],
          objectivesEn: ['Calculate the first derivative of composite and trigonometric functions.', 'Determine intervals of increase and decrease and inflection points.', 'Solve optimization problems to calculate maximum volume and area.'],
          activitiesAr: ['رسم المنحنيات وحساب المماسات يدوياً ورقياً.', 'استخدام برمجية جيوجبرا لملاحظة الاتصال ونقاط الانعطاف بيانيا.', 'دراسة حالة حقيقية لتقليل تكاليف تعبئة معلبات الأغذية.'],
          activitiesEn: ['Drawing curves and calculating tangents by hand.', 'Using GeoGebra to visualize continuity and inflection points.', 'Real case study on minimizing packaging costs for food cans.'],
          standardAr: 'معيار التفاضل والتكامل المتقدم 12.1 - النهايات والاشتقاق وتطبيقاتها',
          standardEn: 'Standard Advanced Calculus 12.1 - Limits, Differentiation, & Applications'
        },
        {
          id: 'gr12-math-ch2',
          titleAr: 'الفصل الثاني: التكامل غير المحدود وتطبيقاته',
          titleEn: 'Chapter 2: Integration & Applications',
          descriptionAr: 'مفهوم التكامل كمساحة تحت المنحنى، طرق التكامل بالتعويض والأجزاء، وحساب المساحات والحجوم الدورانية.',
          descriptionEn: 'Concept of integration as area under a curve, methods of substitution and parts, calculating areas and volumes of revolution.',
          objectivesAr: ['أن يحسب الطالب التكامل غير المحدود للدوال الجبرية والمثلثية.', 'أن يطبق التكامل المحدد لحساب المساحة المحصورة بين منحنيين.', 'أن يحسب حجم الجسم الدوراني الناشئ عن دوران منطقة حول محور السينات.'],
          objectivesEn: ['Calculate indefinite integration of algebraic and trigonometric functions.', 'Apply definite integration to find the area bounded by two curves.', 'Calculate the volume of a solid of revolution around the x-axis.'],
          activitiesAr: ['تقريب المساحة باستخدام طريقة مستطيلات ريمان.', 'رسم ثلاثي الأبعاد للأجسام الدورانية المتولدة.', 'حل مسائل تطبيقية حول حساب الشغل المبذول وحساب المراكز.'],
          activitiesEn: ['Approximating area using Rieman sums.', 'Graphing 3D solids of revolution generated.', 'Solving applied physics problems on work and center of mass.'],
          standardAr: 'معيار التفاضل والتكامل المتقدم 12.2 - حساب التكامل وتطبيقاته الهندسية والفيزيائية',
          standardEn: 'Standard Advanced Calculus 12.2 - Integration & Geometric/Physical Applications'
        }
      ]
    },
    {
      subjectAr: 'علوم الحاسوب',
      subjectEn: 'Computer Science',
      chapters: [
        {
          id: 'gr12-cs-ch1',
          titleAr: 'الفصل الأول: هياكل البيانات والخوارزميات',
          titleEn: 'Chapter 1: Data Structures & Algorithms',
          descriptionAr: 'دراسة المصفوفات، القوائم المترابطة، المكدس، والصف، وخوارزميات البحث والفرز الأساسية.',
          descriptionEn: 'Study of arrays, linked lists, stacks, queues, and basic searching and sorting algorithms.',
          objectivesAr: ['أن يميز الطالب بين المكدس (Stack) والصف (Queue) في الذاكرة.', 'أن يكتب كود خوارزمية البحث الثنائي (Binary Search).', 'أن يحلل التعقيد الزمني لخوارزميات ترتيب البيانات (Bubble vs Quick Sort).'],
          objectivesEn: ['Distinguish between Stack and Queue data structures in memory.', 'Implement the Binary Search algorithm in code.', 'Analyze the time complexity of sorting algorithms (Bubble vs Quick Sort).'],
          activitiesAr: ['لعب الأدوار بالصف لتمثيل حركة البيانات بالمكدس.', 'تطبيق عملي لكود الفرز السريع بالفيجوال ستوديو.', 'مسابقات فرز وتتبع كود جافاسكريبت.'],
          activitiesEn: ['Role-playing in the classroom to represent Stack data movement.', 'Practical coding of Quick Sort in Visual Studio.', 'JavaScript sorting and tracing code challenges.'],
          standardAr: 'معيار علوم الحاسوب والتفكير الخوارزمي 12.1 - هياكل البيانات وتعقيد الخوارزميات',
          standardEn: 'Standard Computer Science & Algorithmic Thinking 12.1 - Data Structures & Algorithm Complexity'
        }
      ]
    }
  ]
};
