public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;

    public UserService(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public UserDTO RegisterUser(UserDTO userDto)
    {
        var hashedPassword = BCrypt.Net.BCrypt.HashPassword(userDto.Password);

        var user = new User 
        {
            Name = userDto.Name, 
            Email = userDto.Email, 
            Phone = userDto.Phone,
            Address = userDto.Address,
            Password = hashedPassword,
            Photo = userDto.Photo
        };
        _userRepository.Add(user);

        return new UserDTO
        {
            Id = user.Id,
            Name = user.Name,
            Email = user.Email,
            Phone = user.Phone,
            Address = user.Address,
            Password = user.Password,
            Photo = user.Photo
        };
    }

    public UserDTO? GetUserDetails(int id)
    {
        var user = _userRepository.GetById(id);
        
        // CORREÇÃO: Adicionado o Id que faltava
        return user != null ? new UserDTO 
        { 
            Id = user.Id, 
            Name = user.Name, 
            Email = user.Email,
            Phone = user.Phone,
            Address = user.Address,
            Password = user.Password,
            Photo = user.Photo
        } : null;
    }

    // CORREÇÃO CS0535: Implementação do método que faltava na interface
    public UserDTO? GetUserByEmail(string email)
    {
        var user = _userRepository.GetByEmail(email);
        
        return user != null ? new UserDTO 
        { 
            Id = user.Id,
            Name = user.Name, 
            Email = user.Email,
            Phone = user.Phone,
            Address = user.Address,
            Password = user.Password,
            Photo = user.Photo
        } : null;
    }

    public List<UserDTO> GetAllUsers()
    {
        // CORREÇÃO CS8604: Proteção contra lista nula
        var users = _userRepository.ListAll() ?? Enumerable.Empty<User>();

        return users.Select(user => new UserDTO
        {
            Id = user.Id,
            Name = user.Name,
            Email = user.Email,
            Phone = user.Phone,
            Address = user.Address,
            Password = user.Password,
            Photo = user.Photo
        }).ToList();
    }

    public UserDTO? UpdateUser(int id, UserDTO userDto)
    {
        var user = _userRepository.GetById(id);
        if (user == null) return null;
        
        // Atualiza campos normais
        user.Name = userDto.Name;
        user.Email = userDto.Email;
        user.Phone = userDto.Phone;
        user.Address = userDto.Address;
        user.Photo = userDto.Photo;
        
        // CORREÇÃO: Só criptografa e atualiza a senha SE ela foi informada
        if (!string.IsNullOrEmpty(userDto.Password))
        {
            user.Password = BCrypt.Net.BCrypt.HashPassword(userDto.Password);
        }
        // Se userDto.Password for vazio, mantém a user.Password antiga (do banco)
        
        _userRepository.Update(user);
        
        return new UserDTO
        {
            Id = user.Id, // Importante retornar o ID
            Name = user.Name,
            Email = user.Email,
            Phone = user.Phone,
            Address = user.Address,
            // Não retornamos a senha no DTO de resposta por segurança
            Photo = user.Photo
        };
    }

    public bool DeleteUser(int id)
    {
        var user = _userRepository.GetById(id);
        if (user == null) return false;
        _userRepository.Delete(id);
        return true;
    }

    public UserDTO? ValidateUser(string email, string password)
    {
        var user = _userRepository.GetByEmail(email);
        
        // Verifica se usuário existe e se a senha bate
        if (user == null || !BCrypt.Net.BCrypt.Verify(password, user.Password))
            return null;

        return new UserDTO
        {
            Id = user.Id,
            Name = user.Name,
            Email = user.Email,
            Phone = user.Phone,
            Address = user.Address,
            Photo = user.Photo
        };
    }
}