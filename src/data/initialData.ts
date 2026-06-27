/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FamilyMember, TributeMessage } from '../types';

export const INITIAL_MEMBERS: FamilyMember[] = [
  // Generation 1 (Thủy Tổ)
  {
    id: "g1-p1",
    name: "Nghiêm Đình Bách",
    gender: "male",
    generation: 1,
    birthYear: "1895",
    deathYear: "1972",
    isDeceased: true,
    spouseId: "g1-p2",
    childrenIds: ["g2-p1", "g2-p3", "g2-p5"],
    title: "Thủy Tổ (Cụ Cố)",
    birthPlace: "Thanh Oai, Hà Tây",
    restingPlace: "Nghĩa trang dòng họ Nghiêm, Hà Nội",
    bio: "Người đặt nền móng đầu tiên cho gia tộc Nghiêm tại thủ đô. Cụ là nhà Nho mẫu mực, thầy thuốc bốc thuốc cứu người nổi tiếng khắp vùng."
  },
  {
    id: "g1-p2",
    name: "Lê Thị Mai",
    gender: "female",
    generation: 1,
    birthYear: "1900",
    deathYear: "1985",
    isDeceased: true,
    spouseId: "g1-p1",
    childrenIds: ["g2-p1", "g2-p3", "g2-p5"],
    title: "Cụ Bà",
    birthPlace: "Đan Phượng, Hà Nội",
    restingPlace: "Nghĩa trang dòng họ Nghiêm, Hà Nội",
    bio: "Người phụ nữ hiền thục, đảm đang chu toàn việc nhà để Cụ Ông yên tâm công tác. Cụ nổi tiếng giữ gìn nếp nhà gia phong lễ nghĩa."
  },

  // Generation 2 (Các Chi Ngành)
  // Chi Trưởng
  {
    id: "g2-p1",
    name: "Nghiêm Đình Hùng",
    gender: "male",
    generation: 2,
    birthYear: "1922",
    deathYear: "2005",
    isDeceased: true,
    spouseId: "g2-p2",
    childrenIds: ["g3-p1", "g3-p3", "g3-p5"],
    parentId: "g1-p1",
    title: "Trưởng Chi Cả",
    birthPlace: "Hà Nội",
    restingPlace: "Nghĩa trang Mai Dịch, Hà Nội",
    bio: "Tham gia Cách mạng từ năm 1945, nguyên cán bộ lão thành cách mạng cấp cao. Có nhiều đóng góp lớn cho sự phát triển của quê hương xứ sở."
  },
  {
    id: "g2-p2",
    name: "Trần Thị Lan",
    gender: "female",
    generation: 2,
    birthYear: "1926",
    deathYear: "2012",
    isDeceased: true,
    spouseId: "g2-p1",
    childrenIds: ["g3-p1", "g3-p3", "g3-p5"],
    title: "Bác Gái Cả",
    birthPlace: "Nam Định",
    restingPlace: "Nghĩa trang Mai Dịch, Hà Nội",
    bio: "Nữ nhà giáo ưu tú tận tụy cả đời vì sự nghiệp trồng người, hiền hậu dạt dào tình yêu thương con cháu."
  },
  // Chi Thứ Nam
  {
    id: "g2-p3",
    name: "Nghiêm Đình Trung",
    gender: "male",
    generation: 2,
    birthYear: "1925",
    deathYear: "1998",
    isDeceased: true,
    spouseId: "g2-p4",
    childrenIds: ["g3-p7", "g3-p9"],
    parentId: "g1-p1",
    title: "Trưởng Chi Thứ hai",
    birthPlace: "Hà Nội",
    restingPlace: "Nghĩa trang Thanh Tước, Hà Nội",
    bio: "Kỹ sư cơ khí đầu tiên của thế hệ hai, đóng góp thầm lặng xây dựng các công trình công nghiệp thời kỳ đầu đất nước giải phóng."
  },
  {
    id: "g2-p4",
    name: "Phạm Thị Cúc",
    gender: "female",
    generation: 2,
    birthYear: "1930",
    deathYear: "2015",
    isDeceased: true,
    spouseId: "g2-p3",
    childrenIds: ["g3-p7", "g3-p9"],
    title: "Cô Gái Hai",
    birthPlace: "Hải Phòng",
    restingPlace: "Nghĩa trang Thanh Tước, Hà Nội",
    bio: "Nữ hộ sinh tận tụy đã đỡ đầu chào đời cho hàng nghìn em bé, luôn mang lại niềm vui và sự lạc quan."
  },
  // Chi Cô Út (Ngoại)
  {
    id: "g2-p5",
    name: "Nghiêm Thị Đào",
    gender: "female",
    generation: 2,
    birthYear: "1928",
    deathYear: "2018",
    isDeceased: true,
    spouseId: "g2-p6",
    childrenIds: [],
    parentId: "g1-p1",
    title: "Cô Út",
    birthPlace: "Hà Nội",
    restingPlace: "Gia Lâm, Hà Nội",
    bio: "Lương y tài đức vẹn toàn, kế thừa bài thuốc nam gia truyền từ Cụ Cố để tiếp tục giúp đỡ cộng đồng."
  },
  {
    id: "g2-p6",
    name: "Vũ Văn Sơn",
    gender: "male",
    generation: 2,
    birthYear: "1924",
    deathYear: "2002",
    isDeceased: true,
    spouseId: "g2-p5",
    childrenIds: [],
    title: "Dượng Út",
    birthPlace: "Hưng Yên",
    restingPlace: "Gia Lâm, Hà Nội",
    bio: "Chiến sĩ Điện Biên năm xưa, người cựu chiến binh luôn giữ vững phẩm chất anh bộ đội Cụ Hồ."
  },

  // Generation 3 (Thế Hệ Ba - Đời Con)
  // Con của Chi Trưởng
  {
    id: "g3-p1",
    name: "Nghiêm Đình Mạnh",
    gender: "male",
    generation: 3,
    birthYear: "1950",
    isDeceased: false,
    spouseId: "g3-p2",
    childrenIds: ["g4-p1", "g4-p3"],
    parentId: "g2-p1",
    title: "Trưởng Nam Đời Ba",
    birthPlace: "Hà Nội",
    bio: "Nghệ nhân ưu tú ngành khảm trai truyền thống. Hiện đang là Trưởng Ban Liên lạc dòng họ Nghiêm tại Hà Nội."
  },
  {
    id: "g3-p2",
    name: "Hoàng Thu Thủy",
    gender: "female",
    generation: 3,
    birthYear: "1953",
    isDeceased: false,
    spouseId: "g3-p1",
    childrenIds: ["g4-p1", "g4-p3"],
    title: "Dâu Trưởng Đời Ba",
    birthPlace: "Hà Tĩnh",
    bio: "Nữ nghệ sĩ chèo truyền thống xuất sắc, lưu giữ nhiều làn điệu dân ca cổ xưa nâng niu tinh thần thế hệ trẻ."
  },
  {
    id: "g3-p3",
    name: "Nghiêm Đình Bình",
    gender: "male",
    generation: 3,
    birthYear: "1953",
    deathYear: "2021",
    isDeceased: true,
    spouseId: "g3-p4",
    childrenIds: ["g4-p5"],
    parentId: "g2-p1",
    title: "Thứ Nam Đời Ba",
    birthPlace: "Hà Nội",
    restingPlace: "Công viên Nghĩa trang Thiên Đức, Phú Thọ",
    bio: "Kiến trúc hoa văn tài hoa với nhiều công trình công cộng mang tính biểu tượng đậm hồn Việt."
  },
  {
    id: "g3-p4",
    name: "Đỗ Mỹ Hạnh",
    gender: "female",
    generation: 3,
    birthYear: "1956",
    isDeceased: false,
    spouseId: "g3-p3",
    childrenIds: ["g4-p5"],
    title: "Thím Hai",
    birthPlace: "Bắc Ninh",
    bio: "Dược sĩ cao cấp, đóng góp tích cực cho hoạt động khuyến học của dòng họ."
  },
  {
    id: "g3-p5",
    name: "Nghiêm Thị Hải",
    gender: "female",
    generation: 3,
    birthYear: "1957",
    isDeceased: false,
    spouseId: "g3-p6",
    childrenIds: ["g4-p7"],
    parentId: "g2-p1",
    title: "Cô Ba",
    birthPlace: "Hà Nội",
    bio: "Nhà nghiên cứu văn hóa dân gian Việt Nam, luôn truyền cảm hứng cho thế hệ trẻ gìn giữ nguồn cội."
  },
  {
    id: "g3-p6",
    name: "Lê Văn Nam",
    gender: "male",
    generation: 3,
    birthYear: "1954",
    isDeceased: false,
    spouseId: "g3-p5",
    childrenIds: ["g4-p7"],
    title: "Chú Ba",
    birthPlace: "Thanh Hóa",
    bio: "Nhà văn quân đội đầy nhiệt huyết, tác giả của nhiều cuốn tiểu thuyết hào hùng về người lính."
  },
  // Con của Chi Thứ
  {
    id: "g3-p7",
    name: "Nghiêm Đình Minh",
    gender: "male",
    generation: 3,
    birthYear: "1955",
    isDeceased: false,
    spouseId: "g3-p8",
    childrenIds: ["g4-p8", "g4-p10"],
    parentId: "g2-p3",
    title: "Trưởng Nam Chi Thứ",
    birthPlace: "Hà Nội",
    bio: "Giảng viên Đại học Bách Khoa tài năng, người thầy nâng đỡ hàng nghìn kỹ sư công nghệ tài năng nước nhà."
  },
  {
    id: "g3-p8",
    name: "Nghiêm Thị Dung",
    gender: "female",
    generation: 3,
    birthYear: "1958",
    isDeceased: false,
    spouseId: "g3-p7",
    childrenIds: ["g4-p8", "g4-p10"],
    title: "Thím Chi Thứ",
    birthPlace: "Hải Dương",
    bio: "Bác sĩ nhi khoa luôn ân cần, yêu trẻ và tích cực tham gia thiện nguyện vùng cao."
  },
  {
    id: "g3-p9",
    name: "Nghiêm Thị Hoa",
    gender: "female",
    generation: 3,
    birthYear: "1960",
    isDeceased: false,
    spouseId: "g3-p10",
    childrenIds: [],
    parentId: "g2-p3",
    title: "Cô Út Chi Thứ",
    birthPlace: "Hà Nội",
    bio: "Doanh nhân thành đạt, tài trợ chính cho quỹ khuyến học 'Nghiêm Gia Chắp Cánh Ước Mơ'."
  },
  {
    id: "g3-p10",
    name: "Phan Văn Đức",
    gender: "male",
    generation: 3,
    birthYear: "1956",
    isDeceased: false,
    spouseId: "g3-p9",
    childrenIds: [],
    title: "Dượng Đức",
    birthPlace: "Nghệ An",
    bio: "Nghệ sĩ nhiếp ảnh tài ba, tác giả của nhiều bộ sưu tập ảnh quý báu lưu trữ lịch sử gia tộc."
  },

  // Generation 4 (Thế Hệ Bốn - Đời Cháu Chắt)
  {
    id: "g4-p1",
    name: "Nghiêm Đình Anh Tuấn",
    gender: "male",
    generation: 4,
    birthYear: "1978",
    isDeceased: false,
    spouseId: "g4-p2",
    childrenIds: [],
    parentId: "g3-p1",
    title: "Cháu Đích Tôn Thế Hệ Bốn",
    birthPlace: "Hà Nội",
    bio: "Thạc sĩ Công nghệ Thông tin, Chuyên gia cao cấp trí tuệ nhân tạo (AI) tại thung lũng Silicon."
  },
  {
    id: "g4-p2",
    name: "Trịnh Kim Oanh",
    gender: "female",
    generation: 4,
    birthYear: "1982",
    isDeceased: false,
    spouseId: "g4-p1",
    childrenIds: [],
    title: "Dâu Đích Tôn Đời Bốn",
    birthPlace: "Sơn La",
    bio: "Nhà thiết kế thời trang tài năng, khôi phục trang phục thổ cẩm cổ truyền đưa ra thế giới."
  },
  {
    id: "g4-p3",
    name: "Nghiêm Thị Hương Giang",
    gender: "female",
    generation: 4,
    birthYear: "1982",
    isDeceased: false,
    spouseId: "g4-p4",
    childrenIds: [],
    parentId: "g3-p1",
    title: "Cháu Gái Cả Chi Trưởng",
    birthPlace: "Hà Nội",
    bio: "Tiến sĩ Kinh tế học, luôn nhiệt huyết gìn giữ nguồn cội và tổ chức liên kết du học sinh Việt Nam."
  },
  {
    id: "g4-p4",
    name: "Trần Thế Anh",
    gender: "male",
    generation: 4,
    birthYear: "1980",
    isDeceased: false,
    spouseId: "g4-p3",
    childrenIds: [],
    title: "Cháu Rể Cả",
    birthPlace: "Thái Bình",
    bio: "Luật sư uy tín, trợ giúp pháp lý miễn phí cho nhiều người nghèo khó và cộng đồng."
  },
  {
    id: "g4-p5",
    name: "Nghiêm Đình Khang",
    gender: "male",
    generation: 4,
    birthYear: "1983",
    isDeceased: false,
    spouseId: "g4-p6",
    childrenIds: [],
    parentId: "g3-p3",
    title: "Cháu Trai Thứ Chi Trưởng",
    birthPlace: "Hà Nội",
    bio: "Nhạc sĩ trẻ tài hoa với nhiều bản ballad ghi dấu lòng người mang âm hưởng quê hương đậm nét."
  },
  {
    id: "g4-p6",
    name: "Nghiêm Hà Phương",
    gender: "female",
    generation: 4,
    birthYear: "1987",
    isDeceased: false,
    spouseId: "g4-p5",
    childrenIds: [],
    title: "Mợ Phương",
    birthPlace: "Quảng Ninh",
    bio: "Nhạc công Piano dịu dàng tại Học viện Âm nhạc Quốc gia Việt Nam."
  },
  {
    id: "g4-p7",
    name: "Lê Nghiêm Minh Thư",
    gender: "female",
    generation: 4,
    birthYear: "1985",
    isDeceased: false,
    childrenIds: [],
    parentId: "g3-p5",
    title: "Cháu Ngoại Đời Bốn",
    birthPlace: "Hà Nội",
    bio: "Biên tập viên truyền hình VTV tài sắc, người kết nối thông điệp bảo vệ môi trường đến mọi miền."
  },
  {
    id: "g4-p8",
    name: "Nghiêm Đình Bảo",
    gender: "male",
    generation: 4,
    birthYear: "1988",
    isDeceased: false,
    spouseId: "g4-p9",
    childrenIds: [],
    parentId: "g3-p7",
    title: "Cháu Đích Tôn Chi Thứ",
    birthPlace: "Hà Nội",
    bio: "Bác sĩ phẫu thuật tim mạch cứu sống hàng trăm ca khó khăn hiểm nghèo."
  },
  {
    id: "g4-p9",
    name: "Phan Minh Anh",
    gender: "female",
    generation: 4,
    birthYear: "1991",
    isDeceased: false,
    spouseId: "g4-p8",
    childrenIds: [],
    title: "Mợ Minh Anh",
    birthPlace: "Đà Nẵng",
    bio: "Nhà nghiên cứu khoa học sinh học, phát triển nhiều chế phẩm nông nghiệp xanh."
  },
  {
    id: "g4-p10",
    name: "Nghiêm Đình Khánh",
    gender: "male",
    generation: 4,
    birthYear: "1992",
    isDeceased: false,
    childrenIds: [],
    parentId: "g3-p7",
    title: "Cháu Út Chi Thứ",
    birthPlace: "Hà Nội",
    bio: "Kỹ sư nông nghiệp công nghệ cao, sáng lập nông trại hữu cơ cung cấp rau củ sạch nổi tiếng."
  }
];

export const INITIAL_TRIBUTES: TributeMessage[] = [
  {
    id: "t1",
    memberName: "Nghiêm Đình Anh Tuấn",
    relation: "Cháu đời thứ 4",
    message: "Con kính lạy Thủy Tổ Nghiêm Đình Bách và Lê Thị Mai. Chúng con hôm nay luôn tự hào về gia phong gia tộc, tự hứa sẽ học hành đỗ đạt, mở mang bờ cõi tri thức để tôn vinh dòng họ.",
    timestamp: "2026-06-25T08:30:00.000Z"
  },
  {
    id: "t2",
    memberName: "Lê Nghiêm Minh Thư",
    relation: "Cháu ngoại đời thứ 4",
    message: "Kính nhớ cụ Thủy Tổ Lê Thị Mai dạt dào nhân ái. Bài học về sự hiếu nghĩa, bao dung của cụ luôn là hành trang quý giá nhất theo con trên suốt chặng đường đời.",
    timestamp: "2026-06-26T14:15:00.000Z"
  }
];
