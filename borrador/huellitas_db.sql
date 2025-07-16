-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: mysql-huellitas.alwaysdata.net
-- Generation Time: Jul 16, 2025 at 03:16 AM
-- Server version: 10.11.13-MariaDB
-- PHP Version: 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `huellitas_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `adopciones`
--

CREATE TABLE `adopciones` (
  `id_adopcion` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `id_animal` int(11) NOT NULL,
  `telefono` varchar(10) DEFAULT NULL,
  `direccion` varchar(40) DEFAULT NULL,
  `fecha_adopcion` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `adopciones`
--

INSERT INTO `adopciones` (`id_adopcion`, `id_usuario`, `id_animal`, `telefono`, `direccion`, `fecha_adopcion`) VALUES
(30, 17, 3, '0123456789', 'balcarce 3749', '2025-07-10'),
(31, 17, 3, '0123456789', 'balcarce 3749', '2025-07-18'),
(32, 17, 1, '0123456789', 'balcarce 3749', '2025-07-16');

-- --------------------------------------------------------

--
-- Table structure for table `animales`
--

CREATE TABLE `animales` (
  `id_animal` int(11) NOT NULL,
  `id_especie` int(11) NOT NULL,
  `nombre_animal` varchar(15) NOT NULL,
  `edad` int(11) NOT NULL,
  `descripcion` varchar(50) NOT NULL,
  `foto_animal` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `animales`
--

INSERT INTO `animales` (`id_animal`, `id_especie`, `nombre_animal`, `edad`, `descripcion`, `foto_animal`) VALUES
(1, 2, 'Firulais', 10, 'Muy tierna y tranquila, color negro y blanco.', '1744587833000.jpg'),
(2, 1, 'Kayla', 12, 'Muy tierna y tranquila, color negro y blanco.', '1746207750800.jpg'),
(3, 1, 'Amapola', 7, 'Muy tierna y tranquila, color negro y blanco.', '1747961462558.jpg'),
(4, 2, 'Callie', 12, 'Muy gris y mala', '1746207757956.jfif'),
(5, 2, 'Naranjita', 1, 'Naranjita muy mimoso', '1748391880493.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `articulos`
--

CREATE TABLE `articulos` (
  `id_articulo` int(11) NOT NULL,
  `nombre_articulo` varchar(25) NOT NULL,
  `detalles` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `articulos`
--

INSERT INTO `articulos` (`id_articulo`, `nombre_articulo`, `detalles`) VALUES
(1, 'Manta', '3m x 3m, color violeta.'),
(2, 'Pipeta', 'Para gatos adultos.'),
(3, 'Collar', 'Color verde.'),
(5, 'Piedritas', '4 kg');

-- --------------------------------------------------------

--
-- Table structure for table `asignaciones`
--

CREATE TABLE `asignaciones` (
  `id_asignacion` int(11) NOT NULL,
  `nombre_asignacion` varchar(15) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `asignaciones`
--

INSERT INTO `asignaciones` (`id_asignacion`, `nombre_asignacion`) VALUES
(1, 'Rescatista'),
(2, 'Veterinario'),
(3, 'Hogar temporal');

-- --------------------------------------------------------

--
-- Table structure for table `donaciones`
--

CREATE TABLE `donaciones` (
  `id_donacion` int(11) NOT NULL,
  `id_articulo` int(11) NOT NULL,
  `nombre_donador` varchar(30) NOT NULL,
  `email` varchar(50) NOT NULL,
  `fecha_donacion` date DEFAULT NULL,
  `descripcion` varchar(100) NOT NULL,
  `estado` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `donaciones`
--

INSERT INTO `donaciones` (`id_donacion`, `id_articulo`, `nombre_donador`, `email`, `fecha_donacion`, `descripcion`, `estado`) VALUES
(3, 2, 'Luciana', 'prueba@gmail.com', '2025-04-18', 'probando', 'aceptada'),
(6, 5, 'Magdalena', 'maga@gmail.com', '2024-03-07', 'quiero donar algo', 'aceptada'),
(11, 5, 'leonel girett', 'leito@gmail.com', '2025-07-15', 'quisiera donar 4kg', 'aceptada'),
(12, 2, 'asd', 'asd@gmail.com', '2025-07-15', 'adadasasd', 'aceptada'),
(13, 1, 'prueba', 'prueba@gmail.com', '2025-07-15', 'wqeqweqwe', 'aceptada'),
(18, 2, 'Leonel Girett', 'Leonelgirett5@gmail.com', '2025-07-15', '25 dono', 'rechazada');

-- --------------------------------------------------------

--
-- Table structure for table `especies`
--

CREATE TABLE `especies` (
  `id_especie` int(11) NOT NULL,
  `nombre_especie` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `especies`
--

INSERT INTO `especies` (`id_especie`, `nombre_especie`) VALUES
(1, 'Perro'),
(2, 'Gato'),
(3, 'Conejo'),
(4, 'Ave'),
(5, 'Hamster'),
(6, 'Pajaro');

-- --------------------------------------------------------

--
-- Table structure for table `genero`
--

CREATE TABLE `genero` (
  `id_genero` int(11) NOT NULL,
  `descripcion` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `genero`
--

INSERT INTO `genero` (`id_genero`, `descripcion`) VALUES
(1, 'F'),
(2, 'M'),
(3, 'Otro');

-- --------------------------------------------------------

--
-- Table structure for table `localidades`
--

CREATE TABLE `localidades` (
  `id_localidad` int(11) NOT NULL,
  `descripcion` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `localidades`
--

INSERT INTO `localidades` (`id_localidad`, `descripcion`) VALUES
(1, 'Zona Sur'),
(2, 'Zona Norte'),
(3, 'Zona Oeste'),
(4, 'Zona Este'),
(5, 'CABA');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id_rol` int(11) NOT NULL,
  `descripcion` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id_rol`, `descripcion`) VALUES
(1, 'Admin'),
(2, 'Usuario');

-- --------------------------------------------------------

--
-- Table structure for table `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` int(11) NOT NULL,
  `nombre_apellido` varchar(40) NOT NULL,
  `email` varchar(30) NOT NULL,
  `id_localidad` int(11) NOT NULL,
  `id_genero` int(11) NOT NULL,
  `password` varchar(250) NOT NULL,
  `foto_usuario` varchar(250) NOT NULL,
  `id_rol` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `nombre_apellido`, `email`, `id_localidad`, `id_genero`, `password`, `foto_usuario`, `id_rol`) VALUES
(16, 'Abi', 'abi@gmail.com', 5, 1, '$2a$08$ZTzdONcZrJ/m1r11dTsWrOI3ofZRr.5HosZ2MiW.zzTB94ge2avA6', '1752093382058.jpg', 2),
(17, 'Leonel Girett', 'leoo9211@hotmail.com', 1, 2, '$2a$08$EWsp7KyBiRwnhr1HWKVkEOgjAolSipYrGsq6drv3ezlaaykMg5jhm', '1747867198962.jpg', 1),
(18, 'Administrador ', 'admin@gmail.com', 5, 1, '$2a$08$jl23bVGjLwLH..p2VBl4leL0aDATN9LEpaQPWugeo4CH27m7BJNTW', '1752364460503.jpg', 1),
(19, 'Leonel Girett', 'leonelgirett5@gmail.com', 1, 2, '$2a$08$vvW45lKLGRfgjySxmEFD6OO3wgvY9K6v2ZCcsL3tHJ9O8CtNeD10a', '1752452006892.jpg', 2);

-- --------------------------------------------------------

--
-- Table structure for table `voluntarios`
--

CREATE TABLE `voluntarios` (
  `id_voluntario` int(11) NOT NULL,
  `email` varchar(50) NOT NULL,
  `id_asignacion` int(11) NOT NULL,
  `tarea` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `voluntarios`
--

INSERT INTO `voluntarios` (`id_voluntario`, `email`, `id_asignacion`, `tarea`) VALUES
(1, 'voluntario1@gmail.com', 3, 'Cuidar durante una semana gatitos recien nacidos.'),
(2, 'voluntario2@gmail.com', 2, 'Por zona sur, lleva botiquin de primeros auxilios.'),
(3, 'voluntario3@gmail.com', 3, 'Cuida a bebes encontrados hasta que puedan encontrar dueño.'),
(13, 'leonelgirett5@gmail.com', 1, 'quiero ser recatista');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `adopciones`
--
ALTER TABLE `adopciones`
  ADD PRIMARY KEY (`id_adopcion`),
  ADD KEY `id_usuario` (`id_usuario`),
  ADD KEY `id_animal` (`id_animal`);

--
-- Indexes for table `animales`
--
ALTER TABLE `animales`
  ADD PRIMARY KEY (`id_animal`),
  ADD KEY `fk_animal_especie` (`id_especie`);

--
-- Indexes for table `articulos`
--
ALTER TABLE `articulos`
  ADD PRIMARY KEY (`id_articulo`);

--
-- Indexes for table `asignaciones`
--
ALTER TABLE `asignaciones`
  ADD PRIMARY KEY (`id_asignacion`);

--
-- Indexes for table `donaciones`
--
ALTER TABLE `donaciones`
  ADD PRIMARY KEY (`id_donacion`),
  ADD KEY `id_articulo` (`id_articulo`);

--
-- Indexes for table `especies`
--
ALTER TABLE `especies`
  ADD PRIMARY KEY (`id_especie`);

--
-- Indexes for table `genero`
--
ALTER TABLE `genero`
  ADD PRIMARY KEY (`id_genero`);

--
-- Indexes for table `localidades`
--
ALTER TABLE `localidades`
  ADD PRIMARY KEY (`id_localidad`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id_rol`);

--
-- Indexes for table `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `fk_localidad` (`id_localidad`),
  ADD KEY `fk_genero` (`id_genero`);

--
-- Indexes for table `voluntarios`
--
ALTER TABLE `voluntarios`
  ADD PRIMARY KEY (`id_voluntario`),
  ADD KEY `fk_voluntarios_asignaciones` (`id_asignacion`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `adopciones`
--
ALTER TABLE `adopciones`
  MODIFY `id_adopcion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `animales`
--
ALTER TABLE `animales`
  MODIFY `id_animal` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

--
-- AUTO_INCREMENT for table `articulos`
--
ALTER TABLE `articulos`
  MODIFY `id_articulo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `asignaciones`
--
ALTER TABLE `asignaciones`
  MODIFY `id_asignacion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `donaciones`
--
ALTER TABLE `donaciones`
  MODIFY `id_donacion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `especies`
--
ALTER TABLE `especies`
  MODIFY `id_especie` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `genero`
--
ALTER TABLE `genero`
  MODIFY `id_genero` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `localidades`
--
ALTER TABLE `localidades`
  MODIFY `id_localidad` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id_rol` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `voluntarios`
--
ALTER TABLE `voluntarios`
  MODIFY `id_voluntario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `adopciones`
--
ALTER TABLE `adopciones`
  ADD CONSTRAINT `adopciones_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`),
  ADD CONSTRAINT `adopciones_ibfk_2` FOREIGN KEY (`id_animal`) REFERENCES `animales` (`id_animal`);

--
-- Constraints for table `animales`
--
ALTER TABLE `animales`
  ADD CONSTRAINT `fk_animal_especie` FOREIGN KEY (`id_especie`) REFERENCES `especies` (`id_especie`);

--
-- Constraints for table `donaciones`
--
ALTER TABLE `donaciones`
  ADD CONSTRAINT `donaciones_ibfk_2` FOREIGN KEY (`id_articulo`) REFERENCES `articulos` (`id_articulo`);

--
-- Constraints for table `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `fk_genero` FOREIGN KEY (`id_genero`) REFERENCES `genero` (`id_genero`),
  ADD CONSTRAINT `fk_localidad` FOREIGN KEY (`id_localidad`) REFERENCES `localidades` (`id_localidad`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
