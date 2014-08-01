CREATE  TABLE `cedar`.`cedar_users` (
  `id` BIGINT NOT NULL ,
  `external_identifier` VARCHAR(50) NULL ,
  `persona_id` BIGINT NULL ,
  `email` VARCHAR(100),
  `password` VARCHAR(100) NULL ,
  `avatar_url` TEXT NULL ,
  `name` VARCHAR(100) NULL ,
  PRIMARY KEY (`id`) ,
  UNIQUE INDEX `persona_id_UNIQUE` (`persona_id` ASC) );