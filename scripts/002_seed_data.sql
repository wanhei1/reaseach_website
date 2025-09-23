-- Insert sample subjects
INSERT INTO public.subjects (name, code, description) VALUES
('计算机科学', 'CS', '计算机科学与技术相关研究'),
('人工智能', 'AI', '人工智能与机器学习'),
('软件工程', 'SE', '软件开发与工程管理'),
('数据科学', 'DS', '数据分析与大数据技术'),
('网络安全', 'SEC', '信息安全与网络防护'),
('机械工程', 'ME', '机械设计与制造'),
('电子工程', 'EE', '电子电路与通信技术'),
('材料科学', 'MS', '新材料研发与应用'),
('生物医学', 'BM', '生物医学工程'),
('环境科学', 'ENV', '环境保护与可持续发展')
ON CONFLICT (code) DO NOTHING;

-- Insert sample papers
INSERT INTO public.papers (title, abstract, keywords, authors, subject_id, publication_date, journal, status) VALUES
('基于深度学习的图像识别算法研究', '本文提出了一种新的深度学习方法用于图像识别，在多个数据集上取得了优异的性能。', ARRAY['深度学习', '图像识别', '卷积神经网络'], ARRAY['张三', '李四', '王五'], (SELECT id FROM public.subjects WHERE code = 'AI'), '2024-01-15', '计算机学报', 'published'),
('软件架构设计模式的演进与应用', '分析了现代软件架构设计模式的发展趋势，并提出了新的架构设计方法。', ARRAY['软件架构', '设计模式', '微服务'], ARRAY['赵六', '钱七'], (SELECT id FROM public.subjects WHERE code = 'SE'), '2024-02-20', '软件学报', 'published'),
('大数据环境下的隐私保护技术', '研究了大数据处理中的隐私保护问题，提出了一种新的差分隐私算法。', ARRAY['大数据', '隐私保护', '差分隐私'], ARRAY['孙八', '周九'], (SELECT id FROM public.subjects WHERE code = 'DS'), '2024-03-10', '数据科学学报', 'under_review'),
('区块链技术在供应链管理中的应用', '探讨了区块链技术如何改善供应链管理的透明度和安全性。', ARRAY['区块链', '供应链', '智能合约'], ARRAY['吴十', '郑十一'], (SELECT id FROM public.subjects WHERE code = 'SEC'), '2024-04-05', '信息安全学报', 'submitted'),
('智能制造系统的优化算法研究', '针对智能制造系统提出了新的优化算法，提高了生产效率。', ARRAY['智能制造', '优化算法', '工业4.0'], ARRAY['冯十二', '陈十三'], (SELECT id FROM public.subjects WHERE code = 'ME'), '2024-05-12', '机械工程学报', 'accepted');
