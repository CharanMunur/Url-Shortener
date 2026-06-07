package com.example.demo.utils;

public class Base62Encoder {

    private static final String ALPHABET =
        "mK9xQvR3pL7nWjYt2hDcFbGsUeAzN4oH6iMkV8wXuJ5rCgTlPdEqByZf0S1aI";
    private static final int BASE = ALPHABET.length();

    public static String encode(Long id) {
        if (id == 0) {
            return String.valueOf(ALPHABET.charAt(0));
        }
        StringBuilder res = new StringBuilder();

        while (id > 0) {
            res.append(ALPHABET.charAt((int) (id % BASE)));
            id /= BASE;
        }

        return res.toString();
    }
}
