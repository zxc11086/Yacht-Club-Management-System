/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: buy
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `buy` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int DEFAULT NULL,
  `shipId` int DEFAULT NULL,
  `time` datetime DEFAULT NULL,
  `money` double DEFAULT NULL,
  `status` varchar(255) DEFAULT '正常',
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 18 DEFAULT CHARSET = utf8mb3;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: hire
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `hire` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int DEFAULT NULL,
  `shipId` int DEFAULT NULL,
  `time` datetime DEFAULT NULL,
  `startDate` date DEFAULT NULL,
  `days` int DEFAULT NULL,
  `status` varchar(255) DEFAULT '正常',
  `money` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 19 DEFAULT CHARSET = utf8mb3;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: service
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `service` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `imgurl` varchar(999) DEFAULT NULL,
  `price` int DEFAULT NULL,
  `nums` int DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 6 DEFAULT CHARSET = utf8mb3;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: service_order
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `service_order` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int DEFAULT NULL,
  `serviceId` int DEFAULT NULL,
  `time` datetime DEFAULT NULL,
  `money` double DEFAULT NULL,
  `status` varchar(255) DEFAULT '正常',
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 17 DEFAULT CHARSET = utf8mb3;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: ships
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `ships` (
  `id` int NOT NULL AUTO_INCREMENT,
  `shipname` varchar(50) NOT NULL,
  `imgurl` varchar(999) DEFAULT NULL,
  `buyPrice` int DEFAULT NULL,
  `hirePrice` int DEFAULT NULL,
  `status` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 14 DEFAULT CHARSET = utf8mb3;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: users
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL,
  `name` varchar(20) DEFAULT NULL,
  `sex` varchar(10) DEFAULT NULL,
  `age` int DEFAULT NULL,
  `grade` int DEFAULT '1',
  `email` varchar(50) DEFAULT NULL,
  `balance` double DEFAULT '0',
  `verification_code` int DEFAULT NULL,
  `isverified` int DEFAULT '1',
  `time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 45 DEFAULT CHARSET = utf8mb3;

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: buy
# ------------------------------------------------------------

INSERT INTO
  `buy` (`id`, `userId`, `shipId`, `time`, `money`, `status`)
VALUES
  (16, 2, 7, '2023-12-29 13:20:20', 9999, '正常');
INSERT INTO
  `buy` (`id`, `userId`, `shipId`, `time`, `money`, `status`)
VALUES
  (17, 19, 2, '2023-12-29 18:52:59', 1991, '已退款');

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: hire
# ------------------------------------------------------------

INSERT INTO
  `hire` (
    `id`,
    `userId`,
    `shipId`,
    `time`,
    `startDate`,
    `days`,
    `status`,
    `money`
  )
VALUES
  (
    14,
    2,
    7,
    '2023-12-10 21:34:32',
    '2023-12-11',
    4,
    '已退款',
    48
  );
INSERT INTO
  `hire` (
    `id`,
    `userId`,
    `shipId`,
    `time`,
    `startDate`,
    `days`,
    `status`,
    `money`
  )
VALUES
  (
    17,
    19,
    2,
    '2023-12-29 13:33:35',
    '2023-12-30',
    1,
    '正常',
    23
  );
INSERT INTO
  `hire` (
    `id`,
    `userId`,
    `shipId`,
    `time`,
    `startDate`,
    `days`,
    `status`,
    `money`
  )
VALUES
  (
    18,
    2,
    6,
    '2023-12-29 14:32:48',
    '2023-12-30',
    10,
    '正常',
    1000
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: service
# ------------------------------------------------------------

INSERT INTO
  `service` (`id`, `name`, `imgurl`, `price`, `nums`)
VALUES
  (2, '泰国推拿', './images/1703672203207.png', 999, 187);
INSERT INTO
  `service` (`id`, `name`, `imgurl`, `price`, `nums`)
VALUES
  (3, '美国捏脚', './images/1703672349112.jpg', 888, 1);
INSERT INTO
  `service` (`id`, `name`, `imgurl`, `price`, `nums`)
VALUES
  (5, '印度美食', './images/1703850265174.jpg', 120, 18);

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: service_order
# ------------------------------------------------------------

INSERT INTO
  `service_order` (
    `id`,
    `userId`,
    `serviceId`,
    `time`,
    `money`,
    `status`
  )
VALUES
  (9, 2, 3, '2023-12-27 19:10:36', 888, '已退款');
INSERT INTO
  `service_order` (
    `id`,
    `userId`,
    `serviceId`,
    `time`,
    `money`,
    `status`
  )
VALUES
  (13, 1, 4, '2023-12-29 13:11:29', 123, '正常');
INSERT INTO
  `service_order` (
    `id`,
    `userId`,
    `serviceId`,
    `time`,
    `money`,
    `status`
  )
VALUES
  (14, 2, 2, '2023-12-29 19:34:24', 999, '正常');
INSERT INTO
  `service_order` (
    `id`,
    `userId`,
    `serviceId`,
    `time`,
    `money`,
    `status`
  )
VALUES
  (15, 1, 5, '2023-12-29 19:44:33', 120, '正常');
INSERT INTO
  `service_order` (
    `id`,
    `userId`,
    `serviceId`,
    `time`,
    `money`,
    `status`
  )
VALUES
  (16, 1, 5, '2023-12-29 19:44:36', 120, '正常');

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: ships
# ------------------------------------------------------------

INSERT INTO
  `ships` (
    `id`,
    `shipname`,
    `imgurl`,
    `buyPrice`,
    `hirePrice`,
    `status`
  )
VALUES
  (1, '黑色魅影', './images/1703671107205.jpg', 99999, 20, 0);
INSERT INTO
  `ships` (
    `id`,
    `shipname`,
    `imgurl`,
    `buyPrice`,
    `hirePrice`,
    `status`
  )
VALUES
  (2, '皇家四号', './images/1703671144091.jpg', 1991, 23, 1);
INSERT INTO
  `ships` (
    `id`,
    `shipname`,
    `imgurl`,
    `buyPrice`,
    `hirePrice`,
    `status`
  )
VALUES
  (
    6,
    '凯哥一号',
    './images/1703671248652.jpg',
    99999,
    100,
    1
  );
INSERT INTO
  `ships` (
    `id`,
    `shipname`,
    `imgurl`,
    `buyPrice`,
    `hirePrice`,
    `status`
  )
VALUES
  (7, '皇家一号', './images/1701520432130.png', 9999, 12, 0);
INSERT INTO
  `ships` (
    `id`,
    `shipname`,
    `imgurl`,
    `buyPrice`,
    `hirePrice`,
    `status`
  )
VALUES
  (8, '皇家二号', './images/1701520536292.png', 998, 188, 1);
INSERT INTO
  `ships` (
    `id`,
    `shipname`,
    `imgurl`,
    `buyPrice`,
    `hirePrice`,
    `status`
  )
VALUES
  (9, '皇家三号', './images/1703671258329.jpg', 1958, 66, 1);

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: users
# ------------------------------------------------------------

INSERT INTO
  `users` (
    `id`,
    `username`,
    `password`,
    `name`,
    `sex`,
    `age`,
    `grade`,
    `email`,
    `balance`,
    `verification_code`,
    `isverified`,
    `time`
  )
VALUES
  (
    1,
    'root',
    '2003929czk',
    NULL,
    NULL,
    NULL,
    10,
    NULL,
    299715,
    NULL,
    1,
    '2023-12-14 19:01:11'
  );
INSERT INTO
  `users` (
    `id`,
    `username`,
    `password`,
    `name`,
    `sex`,
    `age`,
    `grade`,
    `email`,
    `balance`,
    `verification_code`,
    `isverified`,
    `time`
  )
VALUES
  (
    2,
    'tourist',
    '1234',
    '程志凯',
    '男',
    20,
    4,
    '3031098162@qq.com',
    999987999,
    NULL,
    1,
    '2023-12-14 19:11:44'
  );

/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
